var items = [];
function getListProduct() {
  axios({
    url: "https://62d007951cc14f8c0882d7fe.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      var data = res.data;

      add = (id) => {
        var item = items.find((item) => item.id == id);
        if (item) {
          item.qty++;
          renderCart();
          saveToLocalStorage();
        } else {
          axios({
            url:
              "https://62d007951cc14f8c0882d7fe.mockapi.io/api/products/" + id,
            method: "GET",
          })
            .then(function (res) {
              res.data.qty = 1;
              items.push(res.data);
              renderCart();
              saveToLocalStorage();
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      };

      getCount = () => {
        return items
          .map((item) => item.qty)
          .reduce((total, qty) => (total += qty), 0);
      };

      getAmount = () => {
        return items
          .map((item) => item.qty * item.price)
          .reduce((total, qty) => (total += qty), 0);
      };
      getAmount();
      remove = (id) => {
        var index = items.findIndex((item) => item.id == id);
        items.splice(index, 1);

        renderCart();
        saveToLocalStorage();
      };

      clear = () => {
        items = [];
        saveToLocalStorage();
      };

      renderProducts(res.data);
    })
    .catch(function (err) {
      console.log(err);
    });
}
function clear() {
  alert("clear");
  // items = [];
  // saveToLocalStorage();
}

function saveToLocalStorage() {
  var json = JSON.stringify(items);

  localStorage.setItem("cart", json);
}

function loadFromLocalStorage() {
  var json = localStorage.getItem("cart");
  items = json ? JSON.parse(json) : [];
}

function renderProducts(data) {
  var contentHTML = "";
  for (var i = 0; i < data.length; i++) {
    var productImg = data[i].img.includes("https")
      ? data[i].img
      : `./../../assets/img/${data[i].img}`;

    contentHTML += `
                <div class="col-lg-4 col-md-6 col-12 mb-5 pb-5 ">
                    <div class="item1" >
                    <a href="#" >
                        <div class="item">
                            <img src="${productImg}" alt="" >
                            <div class="detail">
                             
                                <h2>${data[i].name}</h2>
                                <h3>$${data[i].price}</h3>
                                <h3>Màn hình: ${data[i].screen}</h3>
                                <h3>Camera trước: ${data[i].frontCamera}</h3>
                                <h3>Camera sau: ${data[i].backCamera}</h3>
                                <h3>Mô tả: ${data[i].desc}</h3>
                               
                              
                                <button onclick="add('${data[i].id}')" class="btn-add">Thêm vào giỏ  </button>
                            </div>
                        </div>
                    </a>
                    </div>
                </div>
    
    `;
  }
  document.getElementById("tblProductList").innerHTML = contentHTML;
}

function renderCart() {
  var cartItem = localStorage.getItem("cart");
  cartItem = JSON.parse(cartItem);
  var tbl = document.querySelector(".tblCart");
  if (cartItem && tbl) {
    tbl.innerHTML = "";
    Object.values(cartItem).map((item) => {
      tbl.innerHTML += `
        <tr>
                            <th scope="row">
                                <button class="btn btn-danger" onclick="remove('${
                                  item.id
                                }')">
                                    X
                                </button>
                            </th>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td onchange="saveToLocalStorage()">
                              <button>
                                <i class="fa-solid fa-angle-left"></i>
                              </button>
                              <input  value="${item.qty}" type="number" min="1">
                              <button>
                                <i class="fa-solid fa-angle-right"></i>
                              </button>
                            </td>
                            <td>${item.qty * item.price}</td>
                        </tr>

      `;
    });
    // tbl.innerHTML += `
    //   <button onclick="clear()" class="btn btn-success">Clear</button>
    //  `;
  }
  console.log(cartItem);
}
renderCart();
loadFromLocalStorage();
getListProduct();
