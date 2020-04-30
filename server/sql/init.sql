DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS CreditCards CASCADE;
DROP TABLE IF EXISTS Promos CASCADE;
DROP TABLE IF EXISTS CustomerPromo CASCADE;
DROP TABLE IF EXISTS Riders CASCADE;
DROP TABLE IF EXISTS FTRiders CASCADE;
DROP TABLE IF EXISTS PTRiders CASCADE;

DROP TABLE IF EXISTS WWS CASCADE;
DROP TABLE IF EXISTS MWS CASCADE;
DROP TABLE IF EXISTS Contains CASCADE;

DROP TABLE IF EXISTS Shift CASCADE;
DROP TABLE IF EXISTS PTWorks CASCADE;
DROP TABLE IF EXISTS FTWorks CASCADE;
DROP TABLE IF EXISTS FDSManagers CASCADE;
DROP TABLE IF EXISTS Rates CASCADE;
DROP TABLE IF EXISTS Salaries CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS RestaurantStaffs CASCADE;
DROP TABLE IF EXISTS Menus CASCADE;
DROP TABLE IF EXISTS Foods CASCADE;
DROP TABLE IF EXISTS Consists CASCADE;
DROP TABLE IF EXISTS Places CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;



CREATE TABLE Accounts (
	account_id varchar(255) primary key,
	account_pass varchar(50) not null,
	date_created date not null,
	account_type varchar(255) not null
);

-- Customers relation here--

CREATE TABLE Customers (
	cid varchar(255) references Accounts(account_id) on delete cascade,
	name varchar(255) not null,
	reward_points integer,
	primary key (cid)
);

CREATE TABLE CreditCards (
	cid varchar(255) references Accounts(account_id) on delete cascade,
	card_number varchar(255),
	primary key (cid, card_number)
	--foreign key (cid) references Customers on delete cascade
);

-- Promotion --
CREATE TABLE Promos (
	promo_id serial,
	account_id varchar(255) references Accounts(account_id) on delete cascade,
	start_time timestamp not null, 
	end_time timestamp not null,
	discount integer not null,
	promo_type varchar(255) not null,
	primary key (promo_id)
);

CREATE TABLE CustomerPromo (
	cid varchar(255) references Customers(cid) on delete cascade,
    promo_id serial primary key
);


-- Riders relation here --
CREATE TABLE Riders (
	rid varchar(255) references Accounts(account_id) on delete cascade,
	name varchar(255) not null,
	primary key (rid)
);

CREATE TABLE FTRiders (
	rid varchar(255) references Accounts(account_id) on delete cascade,
	name varchar(255) not null,
	avg_rating real,
    primary key (rid), 
    foreign key (rid) references Riders on delete cascade
);

CREATE TABLE PTRiders (
	rid varchar(255) references Accounts(account_id) on delete cascade,
	name varchar(255) not null,
	avg_rating real,
    primary key (rid)
);

CREATE TABLE Shift (
	shift_id serial primary key,
	work_hour integer not null,
	start_time time not null,
	end_time time not null
);

CREATE TABLE WWS (
	wws_id serial primary key,
	day_1 date,
	day_2 date,
	day_3 date,
	day_4 date,
	day_5 date,
	day_6 date,
	day_7 date 
);

CREATE TABLE Contains (
	wws_id serial references WWS(wws_id) on delete cascade,
	actual_date date not null,
	shift_id integer references Shift(shift_id) on delete cascade,
	primary key (wws_id, actual_date)
);

CREATE TABLE MWS (
	mws_id serial primary key,
	wws1 serial not null references WWS(wws_id),
    wws2 serial not null references WWS(wws_id),
    wws3 serial not null references WWS(wws_id),
    wws4 serial not null references WWS(wws_id)
);

CREATE TABLE PTWorks (
	rid varchar(255) references PTRiders(rid),
	wws_id serial references WWS(wws_id),
	primary key (wws_id, rid)
);

CREATE TABLE FTWorks(
	rid varchar(255) references FTRiders(rid),
	mws_id serial references MWS(mws_id),
	primary key (rid, mws_id)
);


CREATE TABLE FDSManagers (
	fds_id varchar(255) references Accounts(account_id) on delete cascade,
	name varchar(255) not null,
	primary key(fds_id)
); 

CREATE TABLE Restaurants (
	rest_id serial,
	name varchar(255) not null,
    order_threshold money not null,
	address varchar(255) not null,
    primary key(rest_id) 
);

CREATE TABLE Orders (
	oid serial,
	rid varchar(255),
	rest_id integer not null,
	order_status varchar(50) not null,
	delivery_fee money,
	total_price money,
	order_placed timestamp,
	depart_for_rest timestamp,
	arrive_at_rest timestamp,
	depart_for_delivery timestamp,
	deliver_to_cust timestamp,
	promo_used integer,
	primary key (oid),
	foreign key (rid) references Riders,
	foreign key (promo_used) references Promos(promo_id)
);

CREATE TABLE Rates (
	rating integer,
	oid integer,
	rid varchar(255),
	primary key (oid, rid),
	foreign key (oid) references Orders (oid),
	foreign key (rid) references Riders(rid)
);

CREATE TABLE Salaries (
	sid serial primary key,
	rid varchar(255) references Riders,
	start_date date not null,
   	end_date date not null,
	amount money not null
);

CREATE TABLE RestaurantStaffs (
	staff_id varchar(255) references Accounts(account_id) on delete cascade,
    rest_id serial references Restaurants(rest_id),
    primary key(staff_id)
);

CREATE TABLE Menus (
	menu_id serial primary key,
    rest_id serial,
	foreign key (rest_id) references Restaurants on delete cascade
);

CREATE TABLE Foods (
    fid serial primary key,
    menu_id serial,
    name varchar(255) not null,
    price money not null,
    food_limit integer not null,
    quantity integer not null,
    category varchar(255) not null,
    foreign key (menu_id) references Menus on delete cascade
);

CREATE TABLE Consists (
	oid integer references Orders(oid) on delete cascade,
	fid integer references Foods(fid) on delete cascade,
	quantity integer not null,
	total_price money not null,
	primary key(oid, fid)
);

CREATE TABLE Places (
	oid integer references Orders(oid),
	cid varchar(255) references Customers(cid),
	address varchar(255),
	payment_method varchar(255),
	primary key(oid, cid)
);

CREATE TABLE Reviews (
    cid varchar(255),
    fid serial,
    text varchar(255) not null,
    primary key (cid, fid),
    foreign key (fid) references Foods,
    foreign key (cid) references Customers
);

-- Triggers
CREATE OR REPLACE FUNCTION check_max_shift_hour()
   RETURNS trigger AS $$
BEGIN
   If NEW.end_time - NEW.start_time > 4 THEN
RAISE exception 'Given start(%) and end time(%) are more than 4 hours.', NEW.start_time, NEW.end_time;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS max_shift_interval ON Shift;
CREATE TRIGGER max_shift_interval
BEFORE UPDATE OR INSERT
ON Shift
FOR EACH ROW
EXECUTE FUNCTION check_max_shift_hour();

-- Need one more trigger for check whether payment method, date and time for order placed and total_price when order status change to paid
-- Add one more trigger to add the entry in table Consists when order_Status in orders changed to paid

-- Data insertions
-- Accounts
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c861493b-c7ee-4b6a-9d88-3a80da5686f0', 'NI7pkLaD', '1/10/2019', 'FDSManager');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '3d2DMKr5PrT', '10/6/2019', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e954e29a-40c7-42f0-8567-39ecf6705ffe', '0yktWzL7', '2/24/2020', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c5b9026c-77a9-4977-9c30-5656e6b463c9', 'Fs1xGBE', '2/8/2020', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('15f6f4f8-42db-428a-949c-98fee850eefa', 'ymcqme3At', '3/30/2020', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2fa0d23c-c53d-484a-90af-88dfce9e4d90', 'q66zcDrm5a', '5/9/2019', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('20f57096-5a09-4f4a-aa42-d32306752ddd', 'kIecjK03sQYZ', '1/30/2020', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('a805a76a-b8d6-4422-98e9-4f83ab58b1e8', 'wIB1JM', '3/4/2020', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2dfd8ff6-9a23-47ac-b192-560f2ce98424', 'jUSkstY9HQUl', '9/26/2019', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('327b2555-f8d2-4f01-966e-e468b4cea5b0', 'uKELoF', '3/10/2019', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3911899e-8fb4-4ad0-85d3-8b1d4b334a40', 'v2LCrbUvLg', '6/4/2019', 'Customer');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('66e51190-c8fc-4b5b-805d-b23cdb3f1ade', 'E9GxvyFbdtjS', '1/10/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('36f8a429-c338-4bc3-a54a-6a7ca0780e41', 'yrEEYmGcn', '5/1/2020', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('bf4f405e-84ef-458c-b825-63d47379c374', '9a9z2H', '9/6/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('16a72b31-db4d-40bb-9ae6-4aa858cdb406', 'almLfEIRrj3T', '2/10/2020', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f47e6d61-62d2-4775-bf8d-81bafc4eb67f', 'yyXdSlH', '4/12/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('8299a5b8-2c49-485c-9fe5-2fe7cb154478', 'us3Xhu', '6/2/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('6cbc7c7a-cab1-4aec-bfaf-a4b74ca8c818', 'z28nCgK9SWYb', '12/2/2020', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('5365e90e-6617-4f17-9607-89b25407e2f5', 'icIkX2ay5Ar', '11/3/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2c3acca1-cc14-498a-b80a-889cb3fee4b5', 'NSvRBsMQ7z4', '2/18/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('fd1001b8-2503-4685-9661-fff922fa7798', 'Rx6d5HKor', '2/11/2019', 'RestaurantStaff');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 'ksswfSyZo', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f016b0e5-e404-4abf-a824-de805c3e122d', '1F4mKCrVx', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('056b3388-4088-44e1-91a1-9fa128ab4ba3', '87ndxRALrBeO', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e9160f72-2094-413c-9764-e39a5d9e5038', 'byyLVU3', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c9e75699-4da2-4411-9e59-71d4b81856c0', '7V0T7KKEKFXq', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 'LYwVleS', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', 'j7iF5AaiP', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('de4b5419-eed5-4829-b013-36d87e28b4ec', '00t2HuvUplb', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 'LAhF6AVml', '1/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 'BcDUMyc5lI', '5/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 'U2UE8YnAf', '5/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', 'yG9MDVTYdlP', '5/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('ccd9673a-c725-46bd-9577-0d26b4564d3f', 'H33yBh', '6/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('149ff060-8b44-4e1c-a56e-c8e6bff22096', 'mQEhePtZrQ', '7/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('b6ff623a-1568-42f5-9f8e-91d24e4123a6', 'yt9UfI', '8/12/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 'CylPtRE4ju', '2/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('b758096a-3183-4de0-9260-dbfce3bdbb28', 'QTswbLcY', '2/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('94bd068e-1a5c-4a73-92a0-81c64b499dc9', 'xJbueX7H', '2/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c69ffc8f-ab47-46f5-a36d-58406ce626af', 'PQYoS6uP', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 'I78qgG', '12/5/2019', 'FTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e6115a43-b3b7-4b45-9014-5f2ac0f913e2', 'qsfX5Ru', '7/10/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('5bc3951b-9388-4af0-9bf5-ce435acc14f3', '49h9jXB', '7/10/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', 'x5BpVKoIjiUX', '2/10/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('9c79e02d-14b7-4604-b5d3-2afae637bd0b', 'XgFgRDStIRa', '9/4/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 'u0PxpGApRTmO', '7/5/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('ce80388a-d0cc-4096-9a01-7e8ef8d8017b', 'vvTjNg', '1/15/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 'VN4c7SJc', '7/30/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('16710734-c5dc-460c-a7ad-54a7d3c92a63', 'S3LpbBAcSbM', '12/5/2019', 'PTRider');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0dfbf360-7152-4c6a-b460-e103aa1ed4d6', 'LA2aqb4x', '12/5/2019', 'PTRider');

-- Customers
insert into Customers (cid, name, reward_points) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', 'Florida', 30);
insert into Customers (cid, name, reward_points) values ('e954e29a-40c7-42f0-8567-39ecf6705ffe', 'Liesa', 15);
insert into Customers (cid, name, reward_points) values ('c5b9026c-77a9-4977-9c30-5656e6b463c9', 'Fae', 84);
insert into Customers (cid, name, reward_points) values ('15f6f4f8-42db-428a-949c-98fee850eefa', 'Florentia', 84);
insert into Customers (cid, name, reward_points) values ('2fa0d23c-c53d-484a-90af-88dfce9e4d90', 'Deni', 17);
insert into Customers (cid, name, reward_points) values ('20f57096-5a09-4f4a-aa42-d32306752ddd', 'Meriel', 11);
insert into Customers (cid, name, reward_points) values ('a805a76a-b8d6-4422-98e9-4f83ab58b1e8', 'Ripley', 56);
insert into Customers (cid, name, reward_points) values ('2dfd8ff6-9a23-47ac-b192-560f2ce98424', 'Merry', 71);
insert into Customers (cid, name, reward_points) values ('327b2555-f8d2-4f01-966e-e468b4cea5b0', 'Mendie', 24);
insert into Customers (cid, name, reward_points) values ('3911899e-8fb4-4ad0-85d3-8b1d4b334a40', 'Lilyan', 49);

-- FDS Managers
insert into FDSManagers (fds_id, name) values ('c861493b-c7ee-4b6a-9d88-3a80da5686f0', 'Claudetta');

-- Riders
insert into Riders (rid, name) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 'Jonie');
insert into Riders (rid, name) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 'Everard');
insert into Riders (rid, name) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 'Henrie');
insert into Riders (rid, name) values ('58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', 'Orin');
insert into Riders (rid, name) values ('ccd9673a-c725-46bd-9577-0d26b4564d3f', 'Sidnee');
insert into Riders (rid, name) values ('149ff060-8b44-4e1c-a56e-c8e6bff22096', 'Ardene');
insert into Riders (rid, name) values ('b6ff623a-1568-42f5-9f8e-91d24e4123a6', 'Lynna');
insert into Riders (rid, name) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 'Steffane');
insert into Riders (rid, name) values ('b758096a-3183-4de0-9260-dbfce3bdbb28', 'Felicdad');
insert into Riders (rid, name) values ('94bd068e-1a5c-4a73-92a0-81c64b499dc9', 'Katya');
insert into Riders (rid, name) values ('c69ffc8f-ab47-46f5-a36d-58406ce626af', 'Bowie');
insert into Riders (rid, name) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 'Everett');
insert into Riders (rid, name) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 'Nerty');
insert into Riders (rid, name) values ('f016b0e5-e404-4abf-a824-de805c3e122d', 'Tait');
insert into Riders (rid, name) values ('056b3388-4088-44e1-91a1-9fa128ab4ba3', 'Josie');
insert into Riders (rid, name) values ('e9160f72-2094-413c-9764-e39a5d9e5038', 'Adrea');
insert into Riders (rid, name) values ('c9e75699-4da2-4411-9e59-71d4b81856c0', 'Antonie');
insert into Riders (rid, name) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 'Kare');
insert into Riders (rid, name) values ('f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', 'Coriss');
insert into Riders (rid, name) values ('de4b5419-eed5-4829-b013-36d87e28b4ec', 'Zita');
insert into Riders (rid, name) values ('e6115a43-b3b7-4b45-9014-5f2ac0f913e2', 'Travers');
insert into Riders (rid, name) values ('5bc3951b-9388-4af0-9bf5-ce435acc14f3', 'Lemuel');
insert into Riders (rid, name) values ('30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', 'Mireielle');
insert into Riders (rid, name) values ('9c79e02d-14b7-4604-b5d3-2afae637bd0b', 'Eda');
insert into Riders (rid, name) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 'Vic');
insert into Riders (rid, name) values ('ce80388a-d0cc-4096-9a01-7e8ef8d8017b', 'Crosby');
insert into Riders (rid, name) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 'Lambert');
insert into Riders (rid, name) values ('16710734-c5dc-460c-a7ad-54a7d3c92a63', 'Ring');
insert into Riders (rid, name) values ('0dfbf360-7152-4c6a-b460-e103aa1ed4d6', 'Elena');

-- FT Riders
insert into FTRiders (rid, name) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 'Jonie');
insert into FTRiders (rid, name) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 'Everard');
insert into FTRiders (rid, name) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 'Henrie');
insert into FTRiders (rid, name) values ('58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', 'Orin');
insert into FTRiders (rid, name) values ('ccd9673a-c725-46bd-9577-0d26b4564d3f', 'Sidnee');
insert into FTRiders (rid, name) values ('149ff060-8b44-4e1c-a56e-c8e6bff22096', 'Ardene');
insert into FTRiders (rid, name) values ('b6ff623a-1568-42f5-9f8e-91d24e4123a6', 'Lynna');
insert into FTRiders (rid, name) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 'Steffane');
insert into FTRiders (rid, name) values ('b758096a-3183-4de0-9260-dbfce3bdbb28', 'Felicdad');
insert into FTRiders (rid, name) values ('94bd068e-1a5c-4a73-92a0-81c64b499dc9', 'Katya');
insert into FTRiders (rid, name) values ('c69ffc8f-ab47-46f5-a36d-58406ce626af', 'Bowie');
insert into FTRiders (rid, name) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 'Everett');
insert into FTRiders (rid, name) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 'Nerty');
insert into FTRiders (rid, name) values ('f016b0e5-e404-4abf-a824-de805c3e122d', 'Tait');
insert into FTRiders (rid, name) values ('056b3388-4088-44e1-91a1-9fa128ab4ba3', 'Josie');
insert into FTRiders (rid, name) values ('e9160f72-2094-413c-9764-e39a5d9e5038', 'Adrea');
insert into FTRiders (rid, name) values ('c9e75699-4da2-4411-9e59-71d4b81856c0', 'Antonie');
insert into FTRiders (rid, name) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 'Kare');
insert into FTRiders (rid, name) values ('f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', 'Coriss');
insert into FTRiders (rid, name) values ('de4b5419-eed5-4829-b013-36d87e28b4ec', 'Zita');

-- PT Riders
insert into PTRiders (rid, name) values ('e6115a43-b3b7-4b45-9014-5f2ac0f913e2', 'Travers');
insert into PTRiders (rid, name) values ('5bc3951b-9388-4af0-9bf5-ce435acc14f3', 'Lemuel');
insert into PTRiders (rid, name) values ('30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', 'Mireielle');
insert into PTRiders (rid, name) values ('9c79e02d-14b7-4604-b5d3-2afae637bd0b', 'Eda');
insert into PTRiders (rid, name) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 'Vic');
insert into PTRiders (rid, name) values ('ce80388a-d0cc-4096-9a01-7e8ef8d8017b', 'Crosby');
insert into PTRiders (rid, name) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 'Lambert');
insert into PTRiders (rid, name) values ('16710734-c5dc-460c-a7ad-54a7d3c92a63', 'Ring');
insert into PTRiders (rid, name) values ('0dfbf360-7152-4c6a-b460-e103aa1ed4d6', 'Elena');

-- Restaurants
insert into Restaurants (name, order_threshold, address) values ('Exeexe-Restaurant', '$11.47', '10 Dempsey Rd, #01-23, S247700');
insert into Restaurants (name, order_threshold, address) values ('Simonis and Sons', '$12.24', '#01-07 Alexis Condominium, 356 Alexandra Rd, S159948');
insert into Restaurants (name, order_threshold, address) values ('Vandervort, Rice and Lehner', '$12.62', '1 Cuscaden Rd, Level 2 Regent Singapore, Cuscaden Rd, S249715');
insert into Restaurants (name, order_threshold, address) values ('Bergnaum LLC', '$14.06', '260 Upper Bukit Timah Rd, #01-01, S588190');
insert into Restaurants (name, order_threshold, address) values ('Abbott-Harris', '$11.18', '374 Bukit Batok Street 31, HDB, S650374');
insert into Restaurants (name, order_threshold, address) values ('Streich-Predovic', '$11.94', '#01-01 Orchard Rendezvous Hotel, 1 Tanglin Rd, S247905');
insert into Restaurants (name, order_threshold, address) values ('Streich, Brekke and Bednar', '$11.18', '118 Commonwealth Cres, #01-29, S140118');
insert into Restaurants (name, order_threshold, address) values ('Blick, Boyer and Schroeder', '$11.84', 'Faber Peak Singapore, Level 2, 109 Mount Faber Road, 099203');
insert into Restaurants (name, order_threshold, address) values ('Kirlin-Jacobson', '$10.36', '421 River Valley Rd, S248320');
insert into Restaurants (name, order_threshold, address) values ('Ziemann-Halvorson', '$10.20', '#01, 10 Dempsey Rd, 21, S247700');

-- Restaurant staffs
insert into RestaurantStaffs (staff_id, rest_id) values ('66e51190-c8fc-4b5b-805d-b23cdb3f1ade', 1);
insert into RestaurantStaffs (staff_id, rest_id) values ('36f8a429-c338-4bc3-a54a-6a7ca0780e41', 2);
insert into RestaurantStaffs (staff_id, rest_id) values ('bf4f405e-84ef-458c-b825-63d47379c374', 3);
insert into RestaurantStaffs (staff_id, rest_id) values ('16a72b31-db4d-40bb-9ae6-4aa858cdb406', 4);
insert into RestaurantStaffs (staff_id, rest_id) values ('f47e6d61-62d2-4775-bf8d-81bafc4eb67f', 5);
insert into RestaurantStaffs (staff_id, rest_id) values ('8299a5b8-2c49-485c-9fe5-2fe7cb154478', 6);
insert into RestaurantStaffs (staff_id, rest_id) values ('6cbc7c7a-cab1-4aec-bfaf-a4b74ca8c818', 7);
insert into RestaurantStaffs (staff_id, rest_id) values ('5365e90e-6617-4f17-9607-89b25407e2f5', 8);
insert into RestaurantStaffs (staff_id, rest_id) values ('2c3acca1-cc14-498a-b80a-889cb3fee4b5', 9);
insert into RestaurantStaffs (staff_id, rest_id) values ('fd1001b8-2503-4685-9661-fff922fa7798', 10);

-- WWS
-- insert into WWS (wws_id) values(1);
-- insert into WWS (wws_id) values(2);
-- insert into WWS (wws_id) values(3);
-- insert into WWS (wws_id) values(4);

-- MWS
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (1, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (2, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (3, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (4, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (5, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (6, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (7, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (8, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (9, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (10, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (11, 1, 2, 3, 4);
-- insert into MWS(mws_id, wws1, wws2, wws3, wws4) values (12, 1, 2, 3, 4);

-- PTWorks
-- insert into PTWorks (rid, wws_id) values ('e6115a43-b3b7-4b45-9014-5f2ac0f913e2', 1);
-- insert into PTWorks (rid, wws_id) values ('5bc3951b-9388-4af0-9bf5-ce435acc14f3', 2);
-- insert into PTWorks (rid, wws_id) values ('30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', 3);
-- insert into PTWorks (rid, wws_id) values ('9c79e02d-14b7-4604-b5d3-2afae637bd0b', 4);
-- insert into PTWorks (rid, wws_id) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 1);
-- insert into PTWorks (rid, wws_id) values ('ce80388a-d0cc-4096-9a01-7e8ef8d8017b', 2);
-- insert into PTWorks (rid, wws_id) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 3);
-- insert into PTWorks (rid, wws_id) values ('16710734-c5dc-460c-a7ad-54a7d3c92a63', 4);
-- insert into PTWorks (rid, wws_id) values ('0dfbf360-7152-4c6a-b460-e103aa1ed4d6', 1); 

-- FTWorks
-- insert into FTWorks (rid, mws_id) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 1);
-- insert into FTWorks (rid, mws_id) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 2);
-- insert into FTWorks (rid, mws_id) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 3);
-- insert into FTWorks (rid, mws_id) values ('58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', 4);
-- insert into FTWorks (rid, mws_id) values ('ccd9673a-c725-46bd-9577-0d26b4564d3f', 5);
-- insert into FTWorks (rid, mws_id) values ('149ff060-8b44-4e1c-a56e-c8e6bff22096', 6);
-- insert into FTWorks (rid, mws_id) values ('b6ff623a-1568-42f5-9f8e-91d24e4123a6', 7);
-- insert into FTWorks (rid, mws_id) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 8);
-- insert into FTWorks (rid, mws_id) values ('b758096a-3183-4de0-9260-dbfce3bdbb28', 9);
-- insert into FTWorks (rid, mws_id) values ('94bd068e-1a5c-4a73-92a0-81c64b499dc9', 10);
-- insert into FTWorks (rid, mws_id) values ('c69ffc8f-ab47-46f5-a36d-58406ce626af', 11);
-- insert into FTWorks (rid, mws_id) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 12);
-- insert into FTWorks (rid, mws_id) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 1);
-- insert into FTWorks (rid, mws_id) values ('f016b0e5-e404-4abf-a824-de805c3e122d', 4);
-- insert into FTWorks (rid, mws_id) values ('056b3388-4088-44e1-91a1-9fa128ab4ba3', 5);
-- insert into FTWorks (rid, mws_id) values ('e9160f72-2094-413c-9764-e39a5d9e5038', 6);
-- insert into FTWorks (rid, mws_id) values ('c9e75699-4da2-4411-9e59-71d4b81856c0', 7);
-- insert into FTWorks (rid, mws_id) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 8);
-- insert into FTWorks (rid, mws_id) values ('f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', 9);
-- insert into FTWorks (rid, mws_id) values ('de4b5419-eed5-4829-b013-36d87e28b4ec', 10);

-- Contains

-- Salaries
insert into Salaries (sid, rid, start_date, end_date, amount) values (1, '06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', '2020-02-01 01:12:21', '2020-03-01 03:31:20', '$2674.36');
insert into Salaries (sid, rid, start_date, end_date, amount) values (2, '3267e8b9-110c-44fb-a817-2c0b243b21d6', '2020-02-01 03:40:48', '2020-03-01 05:14:34', '$2996.84');
insert into Salaries (sid, rid, start_date, end_date, amount) values (3, '03667134-3ab1-41e2-bff4-e1e6e14d3035', '2020-02-01 18:08:39', '2020-03-01 23:25:53', '$2835.60');
insert into Salaries (sid, rid, start_date, end_date, amount) values (4, '58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', '2020-02-01 20:49:56', '2020-03-01 20:12:25', '$2808.27');
insert into Salaries (sid, rid, start_date, end_date, amount) values (5, 'ccd9673a-c725-46bd-9577-0d26b4564d3f', '2020-02-01 05:20:06', '2020-03-01 08:37:28', '$3788.22');
insert into Salaries (sid, rid, start_date, end_date, amount) values (6, '149ff060-8b44-4e1c-a56e-c8e6bff22096', '2020-02-01 02:07:09', '2020-03-01 07:17:09', '$2866.29');
insert into Salaries (sid, rid, start_date, end_date, amount) values (7, 'b6ff623a-1568-42f5-9f8e-91d24e4123a6', '2020-02-01 01:27:23', '2020-03-01 15:24:51', '$3393.74');
insert into Salaries (sid, rid, start_date, end_date, amount) values (8, '0161cded-c664-4f1b-ad3f-7766dc48fecb', '2020-02-01 14:51:53', '2020-03-01 05:19:50', '$3927.33');
insert into Salaries (sid, rid, start_date, end_date, amount) values (9, 'b758096a-3183-4de0-9260-dbfce3bdbb28', '2020-02-01 16:06:06', '2020-03-01 00:58:10', '$2655.22');
insert into Salaries (sid, rid, start_date, end_date, amount) values (10, '94bd068e-1a5c-4a73-92a0-81c64b499dc9', '2020-02-01 09:16:37', '2020-03-01 15:55:03', '$3828.91');
insert into Salaries (sid, rid, start_date, end_date, amount) values (11, 'c69ffc8f-ab47-46f5-a36d-58406ce626af', '2020-02-01 00:20:46', '2020-03-01 13:33:13', '$2931.22');
insert into Salaries (sid, rid, start_date, end_date, amount) values (12, '3c30a803-6834-41a9-b81e-6d54b6d5512d', '2020-02-01 18:47:25', '2020-03-01 22:16:32', '$3217.69');
insert into Salaries (sid, rid, start_date, end_date, amount) values (13, '0486583b-01d0-4c03-95d1-5e11d75a9efd', '2020-02-01 03:46:16', '2020-03-01 01:29:18', '$3071.09');
insert into Salaries (sid, rid, start_date, end_date, amount) values (14, 'f016b0e5-e404-4abf-a824-de805c3e122d', '2020-02-01 21:49:58', '2020-03-01 13:49:46', '$3259.96');
insert into Salaries (sid, rid, start_date, end_date, amount) values (15, '056b3388-4088-44e1-91a1-9fa128ab4ba3', '2020-02-01 14:00:23', '2020-03-01 07:42:35', '$3359.67');
insert into Salaries (sid, rid, start_date, end_date, amount) values (16, 'e9160f72-2094-413c-9764-e39a5d9e5038', '2020-02-01 16:47:36', '2020-03-01 00:21:25', '$3220.97');
insert into Salaries (sid, rid, start_date, end_date, amount) values (17, 'c9e75699-4da2-4411-9e59-71d4b81856c0', '2020-02-01 01:37:46', '2020-03-01 09:50:08', '$3091.61');
insert into Salaries (sid, rid, start_date, end_date, amount) values (18, '1e9736bd-78ab-4dbd-9adc-40622a2f7223', '2020-02-01 16:23:23', '2020-03-01 07:06:08', '$3927.92');
insert into Salaries (sid, rid, start_date, end_date, amount) values (19, 'f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', '2020-02-01 07:52:36', '2020-03-01 05:12:28', '$2564.14');
insert into Salaries (sid, rid, start_date, end_date, amount) values (20, 'de4b5419-eed5-4829-b013-36d87e28b4ec', '2020-02-01 20:01:01', '2020-03-01 18:46:39', '$3788.71');
insert into Salaries (sid, rid, start_date, end_date, amount) values (21, 'e6115a43-b3b7-4b45-9014-5f2ac0f913e2', '2020-02-01 10:31:46', '2020-03-01 18:13:39', '$3640.98');
insert into Salaries (sid, rid, start_date, end_date, amount) values (22, '5bc3951b-9388-4af0-9bf5-ce435acc14f3', '2020-02-01 16:59:18', '2020-03-01 14:30:32', '$2594.38');
insert into Salaries (sid, rid, start_date, end_date, amount) values (23, '30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', '2020-02-01 11:21:53', '2020-03-01 23:25:51', '$2779.52');
insert into Salaries (sid, rid, start_date, end_date, amount) values (24, '9c79e02d-14b7-4604-b5d3-2afae637bd0b', '2020-02-01 00:57:41', '2020-03-01 07:18:13', '$2556.39');
insert into Salaries (sid, rid, start_date, end_date, amount) values (25, '2534042c-6526-44b1-abd5-532d7b7b281a', '2020-02-01 01:43:29', '2020-03-01 15:58:20', '$2930.18');
insert into Salaries (sid, rid, start_date, end_date, amount) values (26, 'ce80388a-d0cc-4096-9a01-7e8ef8d8017b', '2020-02-01 10:53:38', '2020-03-01 20:49:54', '$2950.20');
insert into Salaries (sid, rid, start_date, end_date, amount) values (27, '68973b78-642a-4ad9-ad0c-8f46977e6bf0', '2020-02-01 02:50:08', '2020-03-01 20:06:09', '$3222.47');
insert into Salaries (sid, rid, start_date, end_date, amount) values (28, '16710734-c5dc-460c-a7ad-54a7d3c92a63', '2020-02-01 15:51:25', '2020-03-01 16:15:50', '$3947.52');
insert into Salaries (sid, rid, start_date, end_date, amount) values (29, '0dfbf360-7152-4c6a-b460-e103aa1ed4d6', '2020-02-01 07:42:42', '2020-03-01 07:34:57', '$3729.79');

-- Menus
insert into Menus (menu_id, rest_id) values (1, 1);
insert into Menus (menu_id, rest_id) values (2, 2);
insert into Menus (menu_id, rest_id) values (3, 3);
insert into Menus (menu_id, rest_id) values (4, 4);
insert into Menus (menu_id, rest_id) values (5, 5);
insert into Menus (menu_id, rest_id) values (6, 6);
insert into Menus (menu_id, rest_id) values (7, 7);
insert into Menus (menu_id, rest_id) values (8, 8);
insert into Menus (menu_id, rest_id) values (9, 9);
insert into Menus (menu_id, rest_id) values (10, 10);

-- Orderscart 
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 1, 'paid', '$5.00', '$16.70', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:05:00', '2020-04-15 12:15:00', '2020-04-15 12:40:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 1, 'paid', '$5.00', '$89.00', '2020-04-15 12:10:00', '2020-04-15 12:10:00', '2020-04-15 12:15:00', '2020-04-15 13:00:00', '2020-04-15 14:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 1, 'paid', '$5.00', '$5.10', '2020-04-15 12:05:00', '2020-04-15 12:05:00', '2020-04-15 12:15:00', '2020-04-15 12:25:00', '2020-04-15 12:35:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 2, 'paid', '$5.00', '$27.93', '2020-04-15 20:00:00', '2020-04-15 20:00:00', '2020-04-15 20:05:00', '2020-04-15 20:07:00', '2020-04-15 20:15:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 2, 'paid', '$5.00', '$76.89', '2020-04-15 12:20:00', '2020-04-15 12:20:00', '2020-04-15 12:30:00', '2020-04-15 12:40:00', '2020-04-15 13:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 3, 'paid', '$5.00', '$92.51', '2020-04-15 12:30:00', '2020-04-15 12:30:00', '2020-04-15 12:40:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 3, 'paid', '$5.00', '$23.82', '2020-04-15 12:25:00', '2020-04-15 12:25:00', '2020-04-15 12:35:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 3, 'paid', '$5.00', '$48.28', '2020-04-15 12:35:00', '2020-04-15 12:35:00', '2020-04-15 12:45:00', '2020-04-15 12:55:00', '2020-04-15 13:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 4, 'paid', '$5.00', '$49.22', '2020-04-15 12:40:00', '2020-04-15 12:40:00', '2020-04-15 12:50:00', '2020-04-15 12:50:00', '2020-04-15 13:00:00', null);
insert into Orders (rid, rest_id, order_status, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 4, 'paid', '$5.00', '$92.67', '2020-04-15 12:45:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', '2020-04-15 13:10:00', '2020-04-15 13:15:00', null);

-- Places
insert into Places (oid, cid, address, payment_method) values (1, '1b39d987-c6b0-4493-bb95-96e51af734b2', 'Blk 760 Yishun Ring rd #08-18 S760760', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (2, '1b39d987-c6b0-4493-bb95-96e51af734b2', 'Blk 761 Yishun Ring rd #08-18 S760761', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (3, '1b39d987-c6b0-4493-bb95-96e51af734b2', 'Blk 762 Yishun Ring rd #08-18 S760762', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (4, 'e954e29a-40c7-42f0-8567-39ecf6705ffe', 'Blk 763 Yishun Ring rd #08-18 S760763', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (5, 'c5b9026c-77a9-4977-9c30-5656e6b463c9', 'Blk 764 Yishun Ring rd #08-18 S760764', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (6, 'c5b9026c-77a9-4977-9c30-5656e6b463c9', 'Blk 765 Yishun Ring rd #08-18 S760765', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (7, 'a805a76a-b8d6-4422-98e9-4f83ab58b1e8', 'Blk 766 Yishun Ring rd #08-18 S760766', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (8, '2dfd8ff6-9a23-47ac-b192-560f2ce98424', 'Blk 767 Yishun Ring rd #08-18 S760767', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (9, '327b2555-f8d2-4f01-966e-e468b4cea5b0', 'Blk 768 Yishun Ring rd #08-18 S760768', 'credit-card');
insert into Places (oid, cid, address, payment_method) values (10, '3911899e-8fb4-4ad0-85d3-8b1d4b334a40', 'Blk 769 Bishan Ring rd #08-18 S760769', 'credit-card');

-- Foods
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe pancake', '$1.20', 1, '1000', 'Main Dish');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe hotcake', '$1.50', 1, '1000', 'Main Dish');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe ice-cream cake', '$10.10', 1, '1000', 'Dessert');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe chocolate cake', '$5.10', 1, '1000', 'Dessert');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe bubble tea', '$2.10', 1, '1000', 'Drink');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe brown sugar milk tea', '$5.10', 1, '1000', 'Drink');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe milo', '$1.10', 1, '1000', 'Drink');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe chicken rice', '$3.50', 1, '1000', 'Main Dish');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe duck rice', '$3.50', 1, '1000', 'Main Dish');
insert into Foods (menu_id, name, price, food_limit, quantity, category) values (1, 'exeexe chicken drumstick', '$1.50', 1, '1000', 'Side Dish');

-- Rates
insert into Rates (rating, oid, rid) values (5, 1, '3267e8b9-110c-44fb-a817-2c0b243b21d6');
insert into Rates (rating, oid, rid) values (5, 2, '1e9736bd-78ab-4dbd-9adc-40622a2f7223');
insert into Rates (rating, oid, rid) values (2, 3, '3c30a803-6834-41a9-b81e-6d54b6d5512d');
insert into Rates (rating, oid, rid) values (1, 4, '2534042c-6526-44b1-abd5-532d7b7b281a');
insert into Rates (rating, oid, rid) values (4, 5, '0486583b-01d0-4c03-95d1-5e11d75a9efd');
insert into Rates (rating, oid, rid) values (2, 7, '0486583b-01d0-4c03-95d1-5e11d75a9efd');
insert into Rates (rating, oid, rid) values (3, 6, '0161cded-c664-4f1b-ad3f-7766dc48fecb');
insert into Rates (rating, oid, rid) values (3, 8, '03667134-3ab1-41e2-bff4-e1e6e14d3035');
insert into Rates (rating, oid, rid) values (2, 9, '68973b78-642a-4ad9-ad0c-8f46977e6bf0');
insert into Rates (rating, oid, rid) values (1, 10, '06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb');

-- Consists
insert into Consists (oid, fid, quantity, total_price) values (1, 1, 2, '$2.40');
insert into Consists (oid, fid, quantity, total_price) values (1, 5, 2, '$4.20');
insert into Consists (oid, fid, quantity, total_price) values (1, 3, 1, '$10.10');
insert into Consists (oid, fid, quantity, total_price) values (2, 4, 1, '$5.10');
insert into Consists (oid, fid, quantity, total_price) values (3, 8, 5, '$17.50');
insert into Consists (oid, fid, quantity, total_price) values (3, 9, 5, '$17.50');
insert into Consists (oid, fid, quantity, total_price) values (3, 10, 2, '$3.00');
insert into Consists (oid, fid, quantity, total_price) values (3, 6, 10, '$51.00');

-- CreditCards
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '4000-1523-1652-4534');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1543-4894-1561-1564');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1565-3158-1564-1945');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1596-1345-1894-1564');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '5434-4565-5270-0457');
