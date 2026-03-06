import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productUrl, imageUrl, cartUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";

const DetailComponent = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, incrementCart } = useAuthStore();

  // ==========================
  // Fetch Single Product
  // ==========================
  const singleHandler = async () => {
    try {
      const res = await axios.get(`${productUrl}/${id}`);
      setProduct(res.data.record);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    singleHandler();
  }, [id]);

  // ==========================
  // Add To Cart
  // ==========================
  const addToCartHandler = async () => {
    try {
      if (!isLoggedIn) {
        alert("Please login first");
        return;
      }

      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        `${cartUrl}/add-to-cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      // ✅ Update cart count in navbar
      incrementCart(1);

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Something went wrong");
    }
  };

  // ==========================
  // UI
  // ==========================
  if (loading) return <h2>Loading...</h2>;

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="detailSection">
      <div className="imgCont">
        <img
          className="singleImage"
          src={`${imageUrl}${product.image}`}
          alt={product.name}
        />
      </div>

      <div className="singleDetail">
        <div className="singleName">
          {product.name}
        </div>

        <div className="singlePrice">
          Price: {product.price}
        </div>

        <div className="singleDesc">
          Description: {product.desc}
        </div>

        <div className="singleBtn">
          <button
            className="singleCartBtn"
            onClick={addToCartHandler}
          >
            Add To Cart
          </button>

          <button className="singleLaterBtn">
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailComponent;
