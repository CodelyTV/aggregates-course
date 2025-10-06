import { ChildProcess, spawn } from "child_process";

export class TestServerManager {
	private server: ChildProcess | null = null;
	private readonly port: number;

	constructor(port = 3000) {
		this.port = port;
	}

	async start(): Promise<void> {
		if (this.server) {
			return;
		}

		return new Promise((resolve, reject) => {
			this.server = spawn("npm", ["run", "dev"], {
				stdio: "pipe",
				detached: false,
			});

			let serverReady = false;
			const timeout = setTimeout(() => {
				if (!serverReady) {
					reject(new Error("Server startup timeout"));
				}
			}, 30000);

			this.server.stdout?.on("data", (data) => {
				const output = data.toString();
				if (
					output.includes("Ready") ||
					output.includes(`localhost:${this.port}`)
				) {
					serverReady = true;
					clearTimeout(timeout);
					resolve();
				}
			});

			this.server.stderr?.on("data", (data) => {
				const error = data.toString();
				if (error.includes("Error") && !serverReady) {
					clearTimeout(timeout);
					reject(new Error(`Server startup error: ${error}`));
				}
			});

			this.server.on("exit", (code) => {
				if (code !== 0 && !serverReady) {
					clearTimeout(timeout);
					reject(new Error(`Server exited with code ${code}`));
				}
			});
		});
	}

	async stop(): Promise<void> {
		if (!this.server) {
			return;
		}

		return new Promise((resolve) => {
			if (!this.server) {
				resolve();

				return;
			}

			this.server.on("exit", () => {
				this.server = null;
				resolve();
			});

			this.server.kill("SIGTERM");

			setTimeout(() => {
				if (this.server && !this.server.killed) {
					this.server.kill("SIGKILL");
					this.server = null;
					resolve();
				}
			}, 5000);
		});
	}

	baseUrl(): string {
		return `http://localhost:${this.port}`;
	}

	mcpUrl(): string {
		return `${this.baseUrl()}/api/mcp`;
	}
}
