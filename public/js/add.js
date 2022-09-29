let items = [];
let item;
let total = 0;
let index;
$(".cart-form").hide()
function add(id, type = "burger") {
    let url = "/getBurgerData?id=" + id;
    if (type !== "burger") {
        url = "/getIngredientData?id=" + id + "&&type=" + type;
    }
    console.log(url);
    fetch(url).then((res) => { return res.json() })
        .then((details) => {
            if (items.length === 0) {
                $(".cart-form").show()
            }
            item = details;
            let itemExists = items.some((k, i) => {
                index = i;
                return (k.id === item.id);

            })
            total = parseFloat((total + item.price).toFixed(2));

            if (!itemExists) {
                details.quantity = 1;
                items.push(details)
                $(".cart-items").append(
                    `
                            <div class="item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <img src="${item.img}" alt="F" />
                                    <div class="item-details d-inline-block">
                                        <h5 class="d-inline-block item-name">${item.name}</h5>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-around">
                                    <div class="control-quantity">
                                        <button class="btn p-0" onclick="add('${id}', '${type}')">
                                            <i class="fa-solid fa-square-plus "></i>
                                        </button>
                                        <input type="text" class="quantity form-check-input m-0 w-25 h-100 text-center" value="1" readonly />
                                        <button class="btn p-0" onclick="remove('${id}')">
                                            <i class="fa-solid fa-square-minus"></i>
                                        </button>
                                    </div>
                                    <h4 class="price">₹${item.price}</h4>
                                </div>
                                <hr>                  
                            </div>           
                            `);


            }
            else {
                total = parseFloat((total + item.price).toFixed(2));

                items[index].quantity++;
                $(".quantity")[index].value = parseInt($(".quantity")[index].value) + 1;
            }
            $("#subtotal").html("₹" + total);
        }).catch((er) => { console.log(er) });
    // console.log(items);

}

function remove(id) {
    let index;
    items.find((o, i) => {
        if (o.id == id) {
            index = i;
        }
    });
    console.log(index);
    total = parseFloat((total - items[index].price).toFixed(2));

    $("#subtotal").html("₹" + total);
    if (parseInt($(".quantity")[index].value) - 1 === 0) {
        $(".item")[index].remove();
        items.splice(index, 1);

        if (items.length === 0) {
            $(".cart-form").hide();
        }
    } else {
        items[index].quantity++;
        $(".quantity")[index].value = parseInt($(".quantity")[index].value) - 1;
    }
}

function checkout(){
    items = items.map(i=>JSON.stringify(i));
    console.log(items);
    sessionStorage.setItem("cart", items);
    window.location.assign("checkout");
}




