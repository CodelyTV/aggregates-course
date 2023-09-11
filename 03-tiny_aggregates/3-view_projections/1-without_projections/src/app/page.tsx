import Image from "next/image";
import Link from "next/link";

import { ProductPrimitives } from "../modules/products/domain/Product";

export default async function Home() {
	async function getProducts(): Promise<ProductPrimitives[]> {
		"use server";

		return (await (
			await fetch("http://localhost:3000/api/products", { cache: "no-cache" })
		).json()) as ProductPrimitives[];
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
				<Image
					className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
					src="/codely.svg"
					alt="Codely Logo"
					width={360}
					height={74}
					priority
				/>
			</div>

			<h1 className="text-4xl font-bold">Products</h1>
			<div className="flex flex-wrap justify-center">
				{(await getProducts()).map((product) => (
					<div
						className="flex flex-col items-center justify-center m-4 p-4 border border-gray-200 rounded-lg shadow-lg"
						key={product.id}
					>
						<Link href={`/products/${product.id}`}>
							<h2 className="text-2xl font-bold">{product.name}</h2>
							<Image
								className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
								src={product.imageUrls[0]}
								alt={product.name}
								width={360}
								height={74}
								priority
							/>
						</Link>
					</div>
				))}
			</div>
		</main>
	);
}
