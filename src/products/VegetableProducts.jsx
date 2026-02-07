import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { cartUrl, imageUrl, productUrl } from '../repo/api_path'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const VegetableProducts = () => {
    const [vegetables, setVegetables] = useState([])
    const [unitPrice, setUnitPrice] = useState({});
    const [quantity] = useState(1);

    const { incrementCart } = useAuthStore()

    const fruitHandler = async () => {
        try {
            const res = await axios.get(`${productUrl}/search?category=vegetables`)
            console.log(res.data.data)
            setVegetables(res.data.data)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fruitHandler()
    }, [])

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
      alert("Please login to buy the products");
    }
  };

    return (
     <div className="containerSection">
        <div className="itemTitle">Category: <span>Fresh Vegetables</span> </div>
           <div className='productSection'>
            {vegetables.map((product) => {
                return (
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
                )
            })}
        </div>
     </div>
    )
}

export default VegetableProducts