 use std::process;

use warp_cors::app::{Config, run};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    pretty_env_logger::init();

    let config = Config::parse().unwrap_or_else(|err| {
        eprintln!("{}", err);
        process::exit(1);
    });

    run(config).await;

    Ok(())
}
