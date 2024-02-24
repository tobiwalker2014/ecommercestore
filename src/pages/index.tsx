import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import Skelton from "../components/Skelton";

const dummyCategories = [
    {
        id: 1,
        name: "Category 1",
        products: [
            {
                id: 1,
                title: "Product 1",
                description: "Product 1 Description",
                price: 100,
                quantity: 10,
                image: "https://picsum.photos/200/300",
            },
            {
                id: 2,
                title: "Product 2",
                description: "Product 2 Description",
                price: 200,
                quantity: 20,
                image: "https://picsum.photos/200/300",
            },
        ],
    },
    {
        id: 2,
        name: "Category 2",
        products: [
            {
                id: 3,
                title: "Product 3",
                description: "Product 3 Description",
                price: 300,
                quantity: 30,
                image: "https://via.placeholder.com/150",
            },
            {
                id: 4,
                title: "Product 4",
                description: "Product 4 Description",
                price: 400,
                quantity: 40,
                image: "https://via.placeholder.com/150",
            },
        ],
    },
];

const Home: NextPage = () => {
    const getAllCategories = async () => {
        try {
            const respJSON = await fetch("/api/categories");
            const resp = await respJSON.json();
            return resp;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    const { isLoading, data } = useQuery({
        queryKey: ["AllCategoreiesWithProducts"],
        queryFn: getAllCategories,
    });

    const categories = data?.categories;

    return (
        <div>
            <Head>
                <title>All Products</title>
                <meta name="description" content="All Products" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto">
                <Navbar />
                {isLoading ? (
                    <Skelton />
                ) : (
                    <ProductGrid
                        showLink={true}
                        categories={categories ?? dummyCategories}
                    />
                )}
            </main>
        </div>
    );
};

export default Home;