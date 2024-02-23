import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import {
    TApiErrorResp,
    TApiSingleCategoryWithProductResp
} from "../../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TApiSingleCategoryWithProductResp | TApiErrorResp>
) {
    if (req.method === 'GET') {
        try {
        const id = req.query.id as string;
        const cursorId = req.query.cursorId as string | undefined;

        const commonSelect = {
            id: true,
            name: true,
            products: {
            orderBy: {
                createdAt: "desc",
            },
            take: 12,
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                price: true,
                quantity: true,
            },
            },
        };

        let categoriesData;

        if (cursorId) {
            categoriesData = await prisma.category.findUnique({
            where: { id },
            select: {
                ...commonSelect,
                products: {
                ...commonSelect.products,
                skip: 1,
                cursor: { id: cursorId },
                },
            },
            });
        } else {
            categoriesData = await prisma.category.findUnique({
            where: { id },
            select: commonSelect,
            });
        }

        if (!categoriesData) {
            return res.status(404).json({ message: `Category not found` });
        }

        let hasMore = categoriesData.products.length > 0;

        res.status(200).json({ category: { ...categoriesData, hasMore } });
        } catch (error) {
        res.status(500).json({
            message: "Something went wrong!! Please try again after sometime",
        });
        }
    } else {
        // Menangani permintaan non-GET
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
