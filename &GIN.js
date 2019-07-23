var shoppingCartJS = (function() {


    var cart = [];

    //store and giftSets page
    if (localStorage.getItem('LScart') === null) {
        localStorage.setItem('LScart', '[]');
    } else {
        cart = JSON.parse(localStorage.getItem('LScart'));

    }

    function returnTotalItemCount() {
        var totalItemCount = cart.reduce(function(sum, item) {
            return sum + Number(item.qty);
        }, 0)
        return totalItemCount;
    }

    function updateLScart() {
        localStorage.setItem('LScart', JSON.stringify(cart));
    }

    class Item {
        constructor(title, price, qty) {
            this.title = title;
            this.price = price;
            this.qty = qty;
        }
    }

    var clickToAdd = function(title, price, qty) {
        var item = new Item(title, price, qty);
        var itemArray = cart.map(item => item.title);


        if (!itemArray.includes(item.title)) {
            cart.push(item);
            updateLScart();

        } else {
            for (let i in cart) {
                if (cart[i].title === item.title) {
                    cart[i].qty += item.qty;
                    updateLScart();

                    return;
                }
            }
        }
    }

    if (document.querySelector('.shop-item-button') != null) {
        document.querySelectorAll('.shop-item-button').forEach(element => {
            element.addEventListener('click', function(event) {
                event.preventDefault();
                var title = event.target.parentElement.children[0].innerText;
                var price = Number(event.target.parentElement.children[1].children[0].innerText);
                var qty = 1;
                clickToAdd(title, price, qty);
                alert(`${title} added to cart.`)
            })
        })
    }



    // cart page 

    if ((JSON.parse(localStorage.getItem('LScart'))).length === 0 && document.querySelector('.cartPageContent') != null) {
        document.querySelector('.cartPageContent').innerHTML = "you cart is empty.";

    } else if ((JSON.parse(localStorage.getItem('LScart'))).length > 0 && document.querySelector('.cartPageContent') != null) {
        function displayCartItems() {
            function cartPageDisplay(title, price, qty) {
                var ItemList = document.querySelector('tbody');
                var item = document.createElement('tr');
                item.innerHTML = `  
                                <td>${title}</td>
                                <td> R ${price}.00</td>
                                <td> <input class="cartPageQuantityInput" type="number" value="${qty}" step="1" min="1" max='99' ></td>
                                <td class="deleteItem" style="color:darkred;"> X </td>
                                `;
                ItemList.appendChild(item);
            }

            cart.forEach(item => {
                cartPageDisplay(item.title, item.price, item.qty);
            });
            cartPageTotalQtyAndAmount();

        }

        displayCartItems();

        function cartPageTotalQtyAndAmount() {
            var totalAmount = cart.reduce(function(sum, item) {
                return sum + Number(item.price) * Number(item.qty);
            }, 0);

            document.querySelector('.totalAmount').innerText = totalAmount;
            document.querySelector('.totalQty').innerText = returnTotalItemCount();


        }
        var deleteItem = document.querySelectorAll('.deleteItem');
        for (var i = 0; i < deleteItem.length; i++) {
            deleteItem[i].addEventListener('click', function(event) {
                event.preventDefault();
                var title = event.target.parentElement.children[0].innerText;
                cart.forEach((element, index) => {
                    if (element.title === title) {
                        cart.splice(index, 1);
                        event.target.parentElement.remove();
                    }
                    updateLScart();
                    cartPageTotalQtyAndAmount();

                });
            });
        }

        var qtyArray = document.querySelectorAll('.cartPageQuantityInput');
        qtyArray.forEach(element => {
            element.addEventListener('change', function(event) {
                var title = event.target.parentElement.parentElement.children[0].innerText;
                cart.forEach((element, index) => {
                    if (element.title === title) {
                        element.qty = Number(event.target.value);
                    }
                    updateLScart();
                    cartPageTotalQtyAndAmount();

                });
            })
        })

    }
    document.querySelector('#sTotal').innerText = returnTotalItemCount();

})();