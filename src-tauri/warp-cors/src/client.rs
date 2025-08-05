use log::trace;
use reqwest::Client;
use warp::http::header::SET_COOKIE;
use warp::http::request::Parts;
use warp::hyper::{self, Body, Response};

use crate::error;
use reqwest::cookie::Jar;
use std::sync::Arc;
use reqwest::cookie::CookieStore;

pub type Request = hyper::Request<Body>;

#[derive(Clone)]
pub(crate) struct HttpsClient {
    client: Client,
    jar: Arc<Jar>,
}

impl HttpsClient {
    pub(crate) fn new() -> Self {
        let jar = Arc::new(Jar::default());
        let client = Client::builder()
            .cookie_provider(jar.clone())
            .build()
            .expect("failed to build HTTP client with cookie store");
        HttpsClient { client, jar }
    }

    pub(crate) async fn request(&self, request: Request) -> Result<Response<Body>, error::Error> {
        let (parts, body) = request.into_parts();

        let Parts {
            method,
            uri,
            headers,
            ..
        } = parts;

        let url = reqwest::Url::parse(&uri.to_string())?;
        let url_clone = url.clone();
        let body = reqwest::Body::wrap_stream(body);
        let request = self
            .client
            .request(method, url_clone)
            .headers(headers)
            .body(body)
            .build()?;

        trace!("Sending request");
        let response = self.client.execute(request).await?;
        trace!("Got response");

        let mut builder = Response::builder();

        for (key, value) in response.headers().iter() {
            builder = builder.header(key, value);
            
            if key == SET_COOKIE {
                builder = builder.header("X-Set-Cookie", value);
            }
        }

        if let Some(cookie_header) = self.jar.cookies(&url) {
            builder = builder.header("X-Set-Cookie", cookie_header);
        }
        let response = builder
            .status(response.status())
            .body(Body::wrap_stream(response.bytes_stream()))?;

        Ok(response)
    }
}
