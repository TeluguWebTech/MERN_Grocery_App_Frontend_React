import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productUrl } from '../repo/api_path'
import { imageUrl } from '../repo/api_path'

const DetailComponent = () => {
    const {id} = useParams()
    const [product, setProduct] = useState("")

    const singleHandler = async()=>{
        try {
            const res = await axios.get(`${productUrl}/${id}`)
            console.log(res.data)
            console.log(res.data.record.image)
            setProduct(res.data.record)
        } catch (error) {
            console.log(error)
        }
    }
useEffect(()=>{
    singleHandler()
}, [])
  return (
    <div>
       <div className="detailSection">
        <div className="imgCont">
         <img className='singleImage' src={`${imageUrl}${product.image}`} alt="" />
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
         <button className='singleCartBtn'>Add To Cart</button>
       <button className='singleLaterBtn'>Save for later</button>
      </div>
        </div>
       </div>
    </div>
  )
}

export default DetailComponent