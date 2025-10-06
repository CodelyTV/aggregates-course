/* eslint-disable check-file/folder-naming-convention,camelcase */
import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { InvoiceCreator } from "../../../../../contexts/mooc/invoices/application/create/InvoiceCreator";
import { container } from "../../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { withErrorHandling } from "../../../../../contexts/shared/infrastructure/http/withErrorHandling";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/postgres/PostgresConnection";

const creator = container.get(InvoiceCreator);
const connection = container.get(PostgresConnection);

type Params = { invoice_id: string };

export const PUT = withErrorHandling(
	async (
		request: NextRequest,
		{ params }: { params: Params },
	): Promise<NextResponse> => {
		const { invoice_id } = params;
		const body = await request.json();

		const { serie, amount, vatId } = body;

		await connection.sql.begin(async (_sql) => {
			await creator.create(invoice_id, serie, amount, vatId);
		});

		return HttpNextResponse.empty();
	},
);
