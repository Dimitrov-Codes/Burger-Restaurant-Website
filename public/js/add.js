
let items = [];
let item;
let total = 0;
let index;
$(".cart-form").hide()
function add(id) {

    fetch("/add?id=" + id).then((res) => { return res.json() })
        .then((details) => {
            if (items.length === 0) {
                $(".cart-form").show()
            }
            item = details;
            total = parseFloat((total + item.price).toFixed(2));
            let itemExists = items.some((k, i) => {
                index = i;
                return (k.id === item.id);

            })

            if (!itemExists) {
                items.push(details)
                $(".cart-items").append(
                    `
                            <div class="item">
                                <div class="d-flex justify-content-between align-items-center">
                                    <img src="${item.img}" alt="F" />
                                    <div class="item-details d-inline-block">
                                        <h5 class="d-inline-block item-name">${item.name}</h5>
                                        <p class="item-desc">${item.desc}</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-around">
                                    <div class="control-quantity">
                                        <button class="btn ms-1 p-0" onclick="add('${id}')">
                                            <i class="fa-solid fa-square-plus"></i>
                                        </button>
                                        <input type="text" class="quantity w-25 h-75 text-center" value="1" />
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

    $("#subtotal").html(total);
    if (parseInt($(".quantity")[index].value) - 1 === 0) {
        $(".item")[index].remove();
        items.splice(index,1);

        if(items.length === 0){
            $(".cart-form").hide();
        }
    } else {

        $(".quantity")[index].value = parseInt($(".quantity")[index].value) - 1;
    }
}