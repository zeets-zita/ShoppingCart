var cartJS = (function() {

    var cart = [];

    // initial page loading ------------------------------------------
    if (localStorage.getItem('LScart') === null) {
        localStorage.setItem('LScart', '[]');
    } else {
        cart = JSON.parse(localStorage.getItem('LScart'));

    }

    // ---------------------

    function returnTotalItemCount() {
        var totalItemCount = cart.reduce(function(sum, item) {
            return sum + Number(item.count);
        }, 0)
        return totalItemCount;
    }




    function updateLScart() {
        localStorage.setItem('LScart', JSON.stringify(cart));
    }


    class Item {
        constructor(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
        }
    }

    var clickToAdd = function(name, price, count) {
        var item = new Item(name, price, count);
        var itemArray = cart.map(item => item.name);

        
        if (!itemArray.includes(item.name)) {
            cart.push(item);
            updateLScart();

        } else {
            for (let i in cart) {
                if (cart[i].name === item.name) {
                    cart[i].count += item.count;
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
                var name = event.target.parentElement.children[0].innerText;
                var price = Number(event.target.parentElement.children[1].children[0].innerText);
                var count = 1;
                clickToAdd(name, price, count);
                alert(`${name} added to cart.`)
            })
        })
    }



    // below is for cart page  ---------------------------------------------------------------------------------------------------------

    if ((JSON.parse(localStorage.getItem('LScart'))).length === 0 && document.querySelector('.cartPageContent') != null) {
        document.querySelector('.cartPageContent').innerHTML = "you cart is empty.";

    } else if ((JSON.parse(localStorage.getItem('LScart'))).length > 0 && document.querySelector('.cartPageContent') != null) {
        function displayCartItems() {
            function cartPageDisplay(name, price, count) {
                var ItemList = document.querySelector('tbody');
                var item = document.createElement('tr');
                item.innerHTML = `  
                                <td>${name}</td>
                                <td> R ${price}.00</td>
                                <td> <input class="cartPageQuantityInput" type="number" value="${count}" step="1" min="1" max='99' ></td>
                                <td class="deleteItem" style="color:darkred;"> X </td>
                                `;
                ItemList.appendChild(item);
            }

            cart.forEach(item => {
                cartPageDisplay(item.name, item.price, item.count);
            });
            cartPageTotalQtyAndAmount();

        }

        displayCartItems();

        function cartPageTotalQtyAndAmount() {
            var totalAmount = cart.reduce(function(sum, item) {
                return sum + Number(item.price) * Number(item.count);
            }, 0);

            document.querySelector('.totalAmount').innerText = totalAmount;
            document.querySelector('.totalQty').innerText = returnTotalItemCount();


        }
        var deleteItem = document.querySelectorAll('.deleteItem');
        for (var i = 0; i < deleteItem.length; i++) {
            deleteItem[i].addEventListener('click', function(event) {
                event.preventDefault();
                var name = event.target.parentElement.children[0].innerText;
                cart.forEach((element, index) => {
                    if (element.name === name) {
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
                var name = event.target.parentElement.parentElement.children[0].innerText;
                cart.forEach((element, index) => {
                    if (element.name === name) {
                        element.count = Number(event.target.value);
                    }
                    updateLScart();
                    cartPageTotalQtyAndAmount();

                });
            })
        })

    }
    document.querySelector('#sTotal').innerText = returnTotalItemCount();

})();