use warp::http::header::{
    ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_EXPOSE_HEADERS,
};
use warp::Reply;

pub(crate) fn allow_credentials(reply: impl warp::Reply) -> impl warp::Reply {
    warp::reply::with_header(reply, ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
}

pub(crate) fn allow_origin(reply: impl warp::Reply, origin: String) -> impl warp::Reply {
    warp::reply::with_header(reply, ACCESS_CONTROL_ALLOW_ORIGIN, origin)
}

pub(crate) fn expose_all_headers(reply: impl warp::Reply) -> impl warp::Reply {
    let reply = reply.into_response();
    let response_headers = reply
        .headers()
        .keys()
        .map(|k| k.as_str())
        .collect::<Vec<&str>>()
        .join(", ");

    if response_headers.is_empty() {
        reply
    } else {
        warp::reply::with_header(reply, ACCESS_CONTROL_EXPOSE_HEADERS, response_headers)
            .into_response()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use warp::hyper::Response;
    use warp::Reply;

    #[tokio::test]
    async fn test_allow_credentials() {
        let response = Response::builder().body("").unwrap();
        let response = allow_credentials(response).into_response();
        assert_eq!(
            response
                .headers()
                .get(ACCESS_CONTROL_ALLOW_CREDENTIALS)
                .unwrap(),
            "true"
        );
    }

    #[tokio::test]
    async fn test_allow_origin() {
        let response = Response::builder().body("").unwrap();
        let origin = "localhost".to_owned();
        let response = allow_origin(response, origin).into_response();
        assert_eq!(
            response.headers().get(ACCESS_CONTROL_ALLOW_ORIGIN).unwrap(),
            "localhost"
        );
    }

    #[tokio::test]
    async fn test_expose_all_headers() {
        let response = Response::builder().body("").unwrap();
        let response = expose_all_headers(response).into_response();
        assert!(response.headers().is_empty());

        let response = Response::builder()
            .header("origin", "localhost")
            .body("")
            .unwrap();
        let response = expose_all_headers(response).into_response();
        assert_eq!(
            response
                .headers()
                .get(ACCESS_CONTROL_EXPOSE_HEADERS)
                .unwrap(),
            "origin"
        );

        let response = Response::builder()
            .header("origin", "localhost")
            .header("x-test-header", "test")
            .body("")
            .unwrap();
        let response = expose_all_headers(response).into_response();
        assert_eq!(
            response
                .headers()
                .get(ACCESS_CONTROL_EXPOSE_HEADERS)
                .unwrap(),
            "origin, x-test-header"
        );
    }
}
