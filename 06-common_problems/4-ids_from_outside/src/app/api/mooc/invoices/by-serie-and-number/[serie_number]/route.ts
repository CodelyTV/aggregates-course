/* eslint-disable check-file/folder-naming-convention,camelcase */
import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { InvoiceBySerieAndNumberSearcher } from "../../../../../../contexts/mooc/invoices/application/search-by-serie-and-number/InvoiceBySerieAndNumberSearcher";
import { container } from "../../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../../contexts/shared/infrastructure/http/withErrorHandling";

const searcher = container.get(InvoiceBySerieAndNumberSearcher);

type Params = { serie_number: string };

export const GET = withErrorHandling(
	async (
		_request: NextRequest,
		{ params }: { params: Params },
	): Promise<NextResponse> => {
		const { serie_number } = params;
		const [serie, numberStr] = serie_number.split("-");

		if (!serie || !numberStr) {
			return HttpNextResponse.badRequest("Invalid serie-number format");
		}

		const number = parseInt(numberStr, 10);

		if (isNaN(number)) {
			return HttpNextResponse.badRequest("Invalid number format");
		}

		const invoice = await searcher.search(serie, number);

		if (!invoice) {
			return HttpNextResponse.notFound();
		}

		return HttpNextResponse.json(invoice.toPrimitives());
	},
);
