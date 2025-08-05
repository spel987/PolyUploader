use std::convert::Infallible;

use warp::Filter;

use crate::client::HttpsClient;

pub(crate) fn with_client(
    client: HttpsClient,
) -> impl Filter<Extract = (HttpsClient,), Error = Infallible> + Clone {
    warp::any().map(move || client.clone())
}
