import CartItem from "./CartItem";

function CartList(props) {
    const { data, updateLocalData } = props; 

    return (
        <>
            <div className="cart">
                {data.map(item => (
                    <CartItem item={item} key={item.info.id} updateLocalData={updateLocalData}/> 
                ))}
            </div>
        </>
    )
}

export default CartList;