const db = require("../database/index.js");

class Customer {
  static getRestaurantList(callback) {
    db.query("SELECT rest_id, name FROM Restaurants", (err, res) => {
      if (err.error) {
        return callback(err, res);
      }
      return callback(err, res);
    });
  }

  static getRewardPoints(name, callback) {
    db.query(
      "SELECT reward_points From Customers WHERE name = $1",
      [name],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getOrders(cid, callback) {
    db.query(
      "select O.oid, R.name as restaurantName, F.name as FoodName, C.quantity, C.total_price, O.total_price as Cost, O.order_placed, O.depart_for_rest, O.arrive_at_rest, O.depart_for_delivery, O.deliver_to_cust, O.rating, C.review, C.fid, O.delivery_fee, COALESCE(U.amount, '$0') AS money, O.points_used from places join consists as C using (oid) left join foods as F using (fid) left join Orders as O on O.oid = C.oid left join Restaurants as R on R.rest_id = O.rest_id left join Uses as U on O.oid = U.oid where cid = $1 AND O.order_status = 'paid' ORDER BY O.oid DESC",
      [cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        let result = res;
        let output = [];
        let i = -1;
        result.map((foodItem) => {
          if (output.length == 0 || output[i].orderNum != foodItem.oid) {
            i++;
            output.push({
              orderNum: foodItem.oid,
              restaurantName: foodItem.restaurantname,
              cost: foodItem.cost,
              foods: [],
              rating: foodItem.rating,
              pointsUsed: foodItem.points_used,
              promoDiscount: foodItem.money,
              deliveryFee: foodItem.delivery_fee,
              ratingSubmitted: foodItem.rating ? true : false,
              order_status: foodItem.deliver_to_cust
                ? "Food delivered"
                : foodItem.depart_for_delivery
                ? "Delivery in progress"
                : foodItem.arrive_at_rest
                ? "Rider reaches the restaurant"
                : foodItem.depart_for_rest
                ? "Rider is on the way to restaurant"
                : "Assigning rider for the order",
            });
          }
          output[i].foods.push({
            FoodName: foodItem.foodname,
            FoodQuantity: foodItem.quantity,
            FoodCost: foodItem.total_price,
            FoodId: foodItem.fid,
            Review: foodItem.review,
            ReviewSubmitted: foodItem.review ? true : false,
          });
        });
        return callback(err, output);
      }
    );
  }

  static getCreditCards(cid, callback) {
    db.query(
      "SELECT card_number FROM CreditCards WHERE cid = $1",
      [cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getTopFiveCreditCards(cid, callback) {
    db.query(
      "SELECT card_number FROM CreditCards WHERE cid = $1 LIMIT 5",
      [cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getFiveRecentDeliveryLocations(cid, callback) {
    db.query(
      "SELECT distinct address as location, MAX(order_placed) FROM Places LEFT JOIN Orders using(oid) WHERE cid = $1 AND order_status = 'paid' AND address IS NOT NULL GROUP BY address ORDER BY MAX(order_placed) DESC, address LIMIT 5",
      [cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static addCreditCard(cid, card_number, callback) {
    db.query(
      "insert into CreditCards (cid, card_number) values ($1, $2)",
      [cid, card_number],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static deleteCreditCard(card_number, callback) {
    db.query(
      "DELETE FROM CreditCards WHERE card_number = $1",
      [card_number],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getRestaurantFoods(restaurantName, callback) {
    db.query(
      "SELECT F.name, F.category, F.quantity, F.price, F.food_limit, F.fid FROM Restaurants as R left join Foods as F using (rest_id) WHERE R.name = $1",
      [restaurantName],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static addOrder(rest_id, status, callback) {
    db.query(
      "INSERT INTO Orders (rest_id, order_status) VALUES ($1, $2)",
      [rest_id, status],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }

        db.query("SELECT MAX(oid) FROM ORDERS", (err, res) => {
          if (err.error) {
            return callback(err, res);
          }
          return callback(err, { num: res[0].max });
        });
      }
    );
  }

  static placeOrder(oid, cid, callback) {
    db.query(
      "INSERT INTO Places (oid, cid) VALUES ($1, $2)",
      [oid, cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static addFood(oid, fid, quantity, total_price, callback) {
    db.query(
      "INSERT INTO Consists (oid, fid, quantity, total_price) VALUES ($1, $2, $3, $4)",
      [oid, fid, quantity, total_price],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getCartOrder(cid, callback) {
    db.query(
      "SELECT O.oid, F.name, C.quantity, C.total_price, C.fid, F.food_limit FROM Customers LEFT JOIN Places using (cid) LEFT JOIN Orders as O using (oid) LEFT JOIN Consists as C on O.oid = C.oid LEFT JOIN Foods as F using (fid) WHERE cid = $1 and O.order_status = 'cart'",
      [cid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        let result = res;
        let output = [];
        let i = -1;
        result.map((foodItem) => {
          if (output.length == 0 || output[i].orderNum != foodItem.oid) {
            i++;
            output.push({
              orderNum: foodItem.oid,
              foods: [],
            });
          }
          output[i].foods.push({
            FoodId: foodItem.fid,
            FoodName: foodItem.name,
            FoodQuantity: foodItem.quantity,
            FoodCost: foodItem.total_price,
            FoodLimit: foodItem.food_limit,
          });
        });
        return callback(err, output);
      }
    );
  }

  static deleteFood(oid, fid, callback) {
    db.query(
      "DELETE FROM Consists WHERE oid = $1 AND fid = $2",
      [oid, fid],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static updateFood(oid, fid, quantity, total_price, callback) {
    db.query(
      "UPDATE Consists SET quantity = $3, total_price = $4 WHERE oid = $1 AND fid = $2",
      [oid, fid, quantity, total_price],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static updateOrder(queryList, valueList, callback) {
    db.transaction(queryList, valueList, (err, res) => {
      console.log(err.error);
      if (err.error) return callback(err, res);
      return callback(err, res);
    });
  }

  static deleteOrder(oid, callback) {
    db.query("DELETE FROM Orders WHERE oid = $1", [oid], (err, res) => {
      if (err.error) {
        return callback(err, res);
      }
      return callback(err, res);
    });
  }

  static checkOrderExists(cid, rest_id, callback) {
    db.query(
      "SELECT O.oid, C.fid, C.quantity, C.total_price From PLACES as P LEFT JOIN ORDERS as O USING (oid) LEFT JOIN CONSISTS as C ON O.oid = C.oid WHERE P.cid = $1 AND O.order_status = 'cart' AND O.rest_id = $2",
      [cid, rest_id],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static updateRatingAndReview(queryList, valueList, callback) {
    console.log(queryList);
    console.log(valueList);
    db.transaction(queryList, valueList, (err, res) => {
      console.log(err.error);
      if (err.error) return callback(err, res);
      return callback(err, res);
    });
  }

  static getReviews(rest_id, callback) {
    db.query(
      "SELECT Foods.name as food_name, Customers.name as customer_name, Consists.review FROM Orders LEFT JOIN Consists using (oid) LEFT JOIN Foods using (fid) LEFT JOIN Places on Orders.oid = Places.oid LEFT JOIN Customers using (cid) WHERE Orders.rest_id = $1 GROUP BY Foods.name, Customers.name, Consists.review, Foods.category HAVING Consists.review IS NOT NULL ORDER BY CASE Foods.category WHEN 'Main Dish' THEN 1 WHEN 'Side Dish' THEN 2 WHEN 'Drink' THEN 3 WHEN 'Dessert' THEN 4 END",
      [rest_id],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static checkCart(cid, rest_id, callback) {
    db.query(
      "SELECT EXISTS (SELECT O.oid From PLACES as P LEFT JOIN ORDERS as O USING (oid) LEFT JOIN CONSISTS as C ON O.oid = C.oid WHERE P.cid = $1 AND O.order_status = 'cart' AND O.rest_id <> $2)",
      [cid, rest_id],
      (err, res) => {
        if (err.error) {
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Customer;
