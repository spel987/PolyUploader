use std::convert::Infallible;

use warp::{path::FullPath, Filter, Rejection};

pub(crate) fn is_url_path() -> impl Filter<Extract = (), Error = Rejection> + Copy {
    warp::path::full()
        .and_then(|path: FullPath| async move {
            path.as_str()
                .trim_start_matches('/')
                .parse::<url::Url>()
                .map_err(|_| warp::reject::not_found())
                .and_then(|url| match url.scheme() {
                    "http" | "https" => Ok(()),
                    _ => Err(warp::reject::not_found()),
                })
        })
        .untuple_one()
}

pub(crate) fn url_path() -> impl Filter<Extract = (url::Url,), Error = Rejection> + Copy {
    warp::path::full()
        .and(query_raw())
        .and_then(|path: FullPath, query: String| async move {
            path.as_str()
                .trim_start_matches('/')
                .parse::<url::Url>()
                .map(|mut url| {
                    if query.is_empty() {
                        url
                    } else {
                        url.query_pairs_mut()
                            .extend_pairs(url::form_urlencoded::parse(query.as_bytes()))
                            .finish()
                            .to_owned()
                    }
                })
                .map_err(|_| warp::reject::not_found())
                .and_then(|url| match url.scheme() {
                    "http" | "https" => Ok(url),
                    _ => Err(warp::reject::not_found()),
                })
        })
}

fn query_raw() -> impl Filter<Extract = (String,), Error = Infallible> + Copy {
    warp::query::raw()
        .or(warp::any().map(String::default))
        .unify()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_is_url_path() {
        let is_url_path = is_url_path();

        let request = warp::test::request().path("http://localhost/");
        assert!(!request.matches(&is_url_path).await);

        let request = warp::test::request().path("http://localhost/somepath/");
        assert!(!request.matches(&is_url_path).await);

        let request = warp::test::request().path("http://localhost/example.org/");
        assert!(!request.matches(&is_url_path).await);

        let request = warp::test::request().path("http://localhost/ftp://example.org/");
        assert!(!request.matches(&is_url_path).await);
    }

    #[tokio::test]
    async fn test_url_path() {
        let url_path = url_path();

        let request = warp::test::request().path("http://localhost/");
        assert!(!request.matches(&url_path).await);

        let request = warp::test::request().path("http://localhost/somepath/");
        assert!(!request.matches(&url_path).await);

        let request = warp::test::request().path("http://localhost/example.org/");
        assert!(!request.matches(&url_path).await);

        let request = warp::test::request().path("http://localhost/https://example/");
        assert_eq!(
            request.filter(&url_path).await.unwrap(),
            url::Url::parse("https://example/").unwrap()
        );

        let request = warp::test::request().path("http://localhost/https://example.org/");
        assert_eq!(
            request.filter(&url_path).await.unwrap(),
            url::Url::parse("https://example.org/").unwrap()
        );

        let request = warp::test::request().path("http://localhost/http://example.org/");
        assert_eq!(
            request.filter(&url_path).await.unwrap(),
            url::Url::parse("http://example.org/").unwrap()
        );

        let request = warp::test::request().path("http://localhost/http://example.org/?foo=bar");
        assert_eq!(
            request.filter(&url_path).await.unwrap(),
            url::Url::parse("http://example.org/?foo=bar").unwrap()
        );

        let request = warp::test::request().path("http://localhost/ftp://example.org/");
        assert!(!request.matches(&url_path).await);
    }

    #[tokio::test]
    async fn test_query_raw() {
        let query = query_raw();

        let request = warp::test::request().path("/test");
        assert_eq!(request.filter(&query).await.unwrap(), String::default());

        let request = warp::test::request().path("/test?");
        assert_eq!(request.filter(&query).await.unwrap(), String::default());

        let request = warp::test::request().path("/test?foo");
        assert_eq!(request.filter(&query).await.unwrap(), "foo");

        let request = warp::test::request().path("/test?foo=bar");
        assert_eq!(request.filter(&query).await.unwrap(), "foo=bar");

        let request = warp::test::request().path("/test?foo=bar&baz=1");
        assert_eq!(request.filter(&query).await.unwrap(), "foo=bar&baz=1");
    }
}
