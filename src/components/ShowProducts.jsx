import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, imageUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";
import SearchFilter from "./SearchFilter";

const ShowProducts = () => {
  const [showProducts, setShowProducts] = useState([]);
  const [unitPrice, setUnitPrice] = useState({});
  const [quantity] = useState(1);

  // 🌍 GLOBAL SEARCH
  const { search } = useSearchStore();

  // 🎯 LOCAL FILTERS
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { incrementCart } = useAuthStore();

  // ✅ SINGLE API CALL
  const searchHandler = async () => {
    try {
      const res = await axios.get(`${productUrl}/search`, {
        params: {
          search,
          category,
          sortBy,
          order,
          page: 1,
          limit: 10,
        },
      });

      setShowProducts(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };
const fetchProducts = async () => {
  try {
    let res;

    // 🟢 SHOW ALL PRODUCTS
    if (category === "All" && !search) {
      res = await axios.get(`${productUrl}/all-products`);
      setShowProducts(res.data.products);
    }
    // 🔍 FILTER / SEARCH PRODUCTS
    else {
      res = await axios.get(`${productUrl}/search`, {
        params: {
          search,
          category: category === "All" ? "" : category,
          sortBy,
          order,
          page: 1,
          limit: 10,
        },
      });

      setShowProducts(res.data.data || []);
    }
  } catch (error) {
    console.error(error);
  }
};


  // 🔄 React to ALL filters
  useEffect(() => {
    searchHandler();
  }, [search, category, sortBy, order]);

  useEffect(()=>{
    fetchProducts()
  }, [search, category, sortBy, order])

  const handleUnitChange = (productId, unit, basePrice) => {
    let price = basePrice;

    if (unit === "500g") price = basePrice / 2;
    if (unit === "2kg") price = basePrice * 2;
    if (unit === "5kg") price = basePrice * 5;

    setUnitPrice((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const cartHandler = async (productId, quantity) => {
    const userToken = localStorage.getItem("userToken");

    try {
      await axios.post(
        `${cartUrl}/add-to-cart`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      alert("Product added to cart");
      incrementCart(quantity);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* 🎛 Category / Sort only */}
      <SearchFilter
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

      {/* 🛒 Products */}
      <div className="productSection">
        {showProducts.map((product) => (
          <section className="proSection" key={product._id}>
            <Link to={`/single/${product._id}`}>
              <div className="proImage">
                <img src={`${imageUrl}${product.image}`} alt={product.name} />
                <h3 className="proName">{product.name}</h3>
              </div>
            </Link>

            <div className="proSub">
              <select
                className="proSelect"
                onChange={(e) =>
                  handleUnitChange(
                    product._id,
                    e.target.value,
                    product.price
                  )
                }
              >
                {/* <option value="500g">500g</option> */}
                <option value="1kg">1kg</option>
                <option value="2kg">2kg</option>
                <option value="5kg">5kg</option>
              </select>

              <h3 className="proPrice">
                Rs {unitPrice[product._id] ?? product.price}
              </h3>
            </div>

            <button
              className="proButton"
              onClick={() => cartHandler(product._id, quantity)}
            >
              Add to Cart
            </button>
          </section>
        ))}
      </div>
    </>
  );
};

export default ShowProducts;
