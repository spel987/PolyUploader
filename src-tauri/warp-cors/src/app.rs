use std::net::SocketAddr;

use clap::{crate_authors, crate_name, crate_version, App, AppSettings, Arg};
use log::{debug, error, info};
#[cfg(unix)]
use tokio::signal::unix::{signal, SignalKind};

use crate::error;
use crate::routes;

pub struct Config {
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn parse() -> Result<Config, Box<dyn std::error::Error>> {
        let matches = App::new(crate_name!())
            .author(crate_authors!())
            .version(crate_version!())
            .setting(AppSettings::UnifiedHelpMessage)
            .arg(
                Arg::with_name("port")
                    .short("p")
                    .long("port")
                    .value_name("PORT"),
            )
            .arg(
                Arg::with_name("host")
                    .short("h")
                    .long("hostname")
                    .value_name("HOST"),
            )
            .get_matches();

        let port = matches.value_of("port").map_or(Ok(3030), |p| p.parse())?;

        let host = matches
            .value_of("host")
            .unwrap_or(env!("CARGO_PKG_NAME"))
            .to_owned();

        Ok(Config { port, host })
    }
}

pub async fn run(config: Config) {
    debug!("Using port: {}", config.port);

    let addr: SocketAddr = ([0, 0, 0, 0], config.port).into();

    debug!("Using host/alias: {}", config.host);

    let (addr, server) =
        warp::serve(routes::routes(config.host)).bind_with_graceful_shutdown(addr, async {
            let signal = shutdown_signal().await;
            if let Err(e) = signal {
                error!("server error: {}", e);
            }
        });

    info!("Listening on http://{}", addr);

    server.await;
}

#[cfg(not(unix))]
async fn shutdown_signal() -> Result<(), error::Error> {
    tokio::signal::ctrl_c().await?;

    info!("Received CTRL-C event");

    Ok(())
}

#[cfg(unix)]
async fn shutdown_signal() -> Result<(), error::Error> {
    let mut term = signal(SignalKind::terminate())?;
    let mut int = signal(SignalKind::interrupt())?;

    tokio::select! {
        _ = int.recv() => {
            info!("Received SIGINT");
        }
        _ = term.recv() => {
            info!("Received SIGTERM");
        }
    }

    Ok(())
}
