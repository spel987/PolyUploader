use futures_util::stream::TryStreamExt;
use log::{error, trace};
use warp::http::header::{HeaderName, CONNECTION, COOKIE, HOST, VIA};
use warp::http::{HeaderMap, HeaderValue, Method};
use warp::hyper::{Body, Request};
use warp::{header, Buf, Filter, Rejection, Stream};

use crate::error;
use crate::filters;

pub(crate) fn proxied_request(
    host: String,
) -> impl Filter<Extract = (Request<Body>,), Error = Rejection> + Clone {
    warp::method()
        .and(filters::url_path())
        .and(header::headers_cloned())
        .and(warp::body::stream())
        .and_then(move |method, url, headers, body| {
            create_request(method, url, headers, body, host.clone())
        })
}

async fn create_request(
    method: Method,
    url: url::Url,
    mut headers: HeaderMap,
    body: impl Stream<Item = Result<impl Buf, warp::Error>> + Send + Sync + 'static,
    host: String,
) -> Result<Request<Body>, Rejection> {
    if let Some(connection_header) = headers.remove(CONNECTION) {
        let headers_to_remove: Vec<&str> = connection_header
            .to_str()
            .unwrap_or_else(|e| {
                error!("Error converting `connection` header to str: {}", e);
                Default::default()
            })
            .split(',')
            .map(|v| v.trim())
            .collect();

        for header in headers_to_remove {
            headers.remove(header);
        }
    }

    headers.remove(COOKIE);
    headers.remove(HOST);

    let via_value = format!("2.0 {}", host);
    append_or_insert_header(&mut headers, VIA, &via_value)?;

    let body = body.map_ok(|mut buf| buf.copy_to_bytes(buf.remaining()));
    let mut request = Request::builder()
        .method(method)
        .uri(url.as_str())
        .body(Body::wrap_stream(body))
        .map_err(error::Error::Http)?;
    *request.headers_mut() = headers;

    trace!("Created request");

    Ok(request)
}

fn append_or_insert_header(
    headers: &mut HeaderMap,
    header_name: HeaderName,
    value: &str,
) -> Result<(), error::Error> {
    if let Some(header_value) = headers.get_mut(&header_name) {
        let via_value = header_value.to_str().unwrap_or_else(|e| {
            error!(
                "Error converting `{}` header value to str: {}",
                &header_name, e
            );
            Default::default()
        });

        if via_value.is_empty() {
            *header_value = HeaderValue::from_str(value)?;
        } else {
            *header_value = HeaderValue::from_str(&format!("{}, {}", via_value, value))?;
        };
    } else {
        headers.insert(&header_name, warp::http::HeaderValue::from_str(value)?);
    }

    Ok(())
}
