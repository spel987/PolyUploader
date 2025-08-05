use warp::http::header::ORIGIN;
use warp::{Filter, Rejection, Reply};

use crate::client::HttpsClient;
use crate::error;
use crate::filters;
use crate::handlers;

pub fn routes(host: String) -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Clone {
    let client = HttpsClient::new();
    preflight()
        .or(proxy(host, client))
        .and(
            warp::header::optional(ORIGIN.as_str())
                .map(|v: Option<String>| v.unwrap_or_else(|| String::from("*"))),
        )
        .map(filters::allow_origin)
        .map(filters::allow_credentials)
        .with(warp::log("warp_cors"))
        .recover(error::recover)
}

fn preflight() -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Copy {
    filters::is_url_path()
        .and(warp::options())
        .and(warp::header("access-control-request-method"))
        .and(warp::header("access-control-request-headers"))
        .and_then(handlers::preflight_request)
}

fn proxy(
    host: String,
    client: HttpsClient,
) -> impl Filter<Extract = (impl Reply,), Error = Rejection> + Clone {
    filters::proxied_request(host)
        .and(filters::with_client(client))
        .and_then(handlers::proxy_request)
        .map(filters::expose_all_headers)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_routes() {
        let host = "example.org".to_owned();
        let routes = routes(host);

        let request = warp::test::request();
        assert!(!request.matches(&routes).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .header("access-control-request-headers", "Origin")
            .header("origin", "localhost")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&routes).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&routes).await);

        let request = warp::test::request()
            .method("GET")
            .header("origin", "localhost")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&routes).await);

        let request = warp::test::request()
            .method("GET")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&routes).await);
    }

    #[tokio::test]
    async fn test_preflight() {
        let preflight = preflight();

        let request = warp::test::request();
        assert!(!request.matches(&preflight).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .path("http://localhost/http://example.org");
        assert!(!request.matches(&preflight).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .path("http://localhost/http://example.org");
        assert!(!request.matches(&preflight).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .header("origin", "localhost")
            .path("http://localhost/http://example.org");
        assert!(!request.matches(&preflight).await);

        let request = warp::test::request()
            .method("GET")
            .header("access-control-request-method", "GET")
            .header("access-control-request-headers", "Origin")
            .header("origin", "localhost")
            .path("http://localhost/http://example.org");
        assert!(!request.matches(&preflight).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .header("access-control-request-headers", "Origin")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&preflight).await);

        let request = warp::test::request()
            .method("OPTIONS")
            .header("access-control-request-method", "GET")
            .header("access-control-request-headers", "Origin")
            .header("origin", "localhost")
            .path("http://localhost/http://example.org");
        assert!(request.matches(&preflight).await);
    }
}
