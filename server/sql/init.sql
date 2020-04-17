DROP TABLE IF EXISTS Accounts CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS CreditCards CASCADE;
DROP TABLE IF EXISTS DeliveryLocations CASCADE;
DROP TABLE IF EXISTS Promos CASCADE;
DROP TABLE IF EXISTS CustomerPromo CASCADE;
DROP TABLE IF EXISTS Riders CASCADE;
DROP TABLE IF EXISTS FTRiders CASCADE;
DROP TABLE IF EXISTS PTRiders CASCADE;

DROP TABLE IF EXISTS DWS CASCADE;
DROP TABLE IF EXISTS ShiftInfo CASCADE;
DROP TABLE IF EXISTS Describes CASCADE;
DROP TABLE IF EXISTS Includes CASCADE;
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

CREATE TABLE DeliveryLocations (
    address varchar(255),
    cid varchar(255) references Accounts(account_id) on delete cascade,
    primary key (cid, address),
    foreign key (cid) references Customers on delete cascade
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

CREATE TABLE DWS (
actual_date date primary key,
	dow integer not null
);

CREATE TABLE Shift (
	shift_id serial primary key,
	rid varchar(255) references Riders(rid) on delete cascade
);

CREATE TABLE ShiftInfo (
	id serial primary key,
    start_time time,
	end_time time
);

CREATE TABLE Describes (
	shift_id serial references Shift(shift_id) on delete cascade,
id serial references ShiftInfo(id) on delete cascade,
	primary key (id, shift_id)
);

CREATE TABLE Includes (
	shift_id serial references Shift(shift_id) on delete cascade, 
	actual_date date references DWS(actual_date) on delete cascade,
	primary key (shift_id, actual_date)
);

CREATE TABLE WWS (
	wws_id serial primary key
);

CREATE TABLE Contains (
	wws_id serial references WWS(wws_id) on delete cascade,
	actual_date date references DWS(actual_date) on delete cascade,
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
    primary key(rest_id) 
);

CREATE TABLE Orders (
	oid serial,
	rid varchar(255),
	rest_id integer not null,
	payment_method text not null,
	delivery_fee money not null,
	total_price money not null,
	order_placed timestamp not null,
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
	oid serial references Orders(oid),
	fid serial references Foods(fid),
	quantity integer not null,
	total_price money not null,
	primary key(oid, fid)
);

CREATE TABLE Places (
	oid serial references Orders(oid),
	cid varchar(255) references Customers(cid),
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

DROP TRIGGER IF EXISTS max_shift_interval ON ShiftInfo;
CREATE TRIGGER max_shift_interval
BEFORE UPDATE OR INSERT
ON ShiftInfo
FOR EACH ROW
EXECUTE FUNCTION check_max_shift_hour();

-- Data insertions
-- Accounts
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c861493b-c7ee-4b6a-9d88-3a80da5686f0', 'NI7pkLaD', '1/10/2019', 'quis odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '3d2DMKr5PrT', '10/6/2019', 'curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e954e29a-40c7-42f0-8567-39ecf6705ffe', '0yktWzL7', '2/24/2020', 'suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c5b9026c-77a9-4977-9c30-5656e6b463c9', 'Fs1xGBE', '2/8/2020', 'eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam dui proin leo');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('15f6f4f8-42db-428a-949c-98fee850eefa', 'ymcqme3At', '3/30/2020', 'volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2fa0d23c-c53d-484a-90af-88dfce9e4d90', 'q66zcDrm5a', '5/9/2019', 'aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('20f57096-5a09-4f4a-aa42-d32306752ddd', 'kIecjK03sQYZ', '1/30/2020', 'lobortis sapien sapien non mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('a805a76a-b8d6-4422-98e9-4f83ab58b1e8', 'wIB1JM', '3/4/2020', 'sapien a libero nam dui proin leo odio porttitor id consequat in');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2dfd8ff6-9a23-47ac-b192-560f2ce98424', 'jUSkstY9HQUl', '9/26/2019', 'quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('327b2555-f8d2-4f01-966e-e468b4cea5b0', 'uKELoF', '10/30/2019', 'nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3911899e-8fb4-4ad0-85d3-8b1d4b334a40', 'v2LCrbUvLg', '6/4/2019', 'rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam dui');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('66e51190-c8fc-4b5b-805d-b23cdb3f1ade', 'E9GxvyFbdtjS', '10/15/2019', 'dolor sit amet consectetuer adipiscing elit proin risus praesent lectus vestibulum quam sapien varius ut');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('36f8a429-c338-4bc3-a54a-6a7ca0780e41', 'yrEEYmGcn', '1/15/2020', 'nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam justo etiam pretium iaculis justo in hac');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('bf4f405e-84ef-458c-b825-63d47379c374', '9a9z2H', '9/6/2019', 'in imperdiet et commodo vulputate justo in blandit ultrices enim');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('16a72b31-db4d-40bb-9ae6-4aa858cdb406', 'almLfEIRrj3T', '2/10/2020', 'libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f47e6d61-62d2-4775-bf8d-81bafc4eb67f', 'yyXdSlH', '4/12/2019', 'rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('8299a5b8-2c49-485c-9fe5-2fe7cb154478', 'us3Xhu', '6/2/2019', 'lectus vestibulum quam sapien varius ut blandit non interdum in ante');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('6cbc7c7a-cab1-4aec-bfaf-a4b74ca8c818', 'z28nCgK9SWYb', '2/14/2020', 'id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate nonummy maecenas');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('5365e90e-6617-4f17-9607-89b25407e2f5', 'icIkX2ay5Ar', '11/3/2019', 'sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2c3acca1-cc14-498a-b80a-889cb3fee4b5', 'NSvRBsMQ7z4', '8/23/2019', 'ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('fd1001b8-2503-4685-9661-fff922fa7798', 'Rx6d5HKor', '11/26/2019', 'sit amet eros suspendisse accumsan tortor quis turpis sed ante');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 'LAhF6AVml', '12/15/2019', 'in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3267e8b9-110c-44fb-a817-2c0b243b21d6', 'BcDUMyc5lI', '12/15/2019', 'ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('03667134-3ab1-41e2-bff4-e1e6e14d3035', 'U2UE8YnAf', '12/15/2019', 'quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('58f57fcf-ee9d-4c16-94b4-ab3d945c83aa', 'yG9MDVTYdlP', '12/15/2019', 'scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('ccd9673a-c725-46bd-9577-0d26b4564d3f', 'H33yBh', '12/15/2019', 'pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('149ff060-8b44-4e1c-a56e-c8e6bff22096', 'mQEhePtZrQ', '12/15/2019', 'metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae mauris');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('b6ff623a-1568-42f5-9f8e-91d24e4123a6', 'yt9UfI', '12/15/2019', 'massa quis augue luctus tincidunt nulla mollis molestie lorem quisque');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0161cded-c664-4f1b-ad3f-7766dc48fecb', 'CylPtRE4ju', '12/5/2019', 'elit proin risus praesent lectus vestibulum quam sapien varius ut blandit non interdum in ante vestibulum');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('b758096a-3183-4de0-9260-dbfce3bdbb28', 'QTswbLcY', '12/5/2019', 'sit amet diam in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('94bd068e-1a5c-4a73-92a0-81c64b499dc9', 'xJbueX7H', '12/5/2019', 'nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c69ffc8f-ab47-46f5-a36d-58406ce626af', 'PQYoS6uP', '12/5/2019', 'vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('3c30a803-6834-41a9-b81e-6d54b6d5512d', 'I78qgG', '12/5/2019', 'hac habitasse platea dictumst etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0486583b-01d0-4c03-95d1-5e11d75a9efd', 'ksswfSyZo', '12/5/2019', 'nulla facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f016b0e5-e404-4abf-a824-de805c3e122d', '1F4mKCrVx', '12/5/2019', 'pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('056b3388-4088-44e1-91a1-9fa128ab4ba3', '87ndxRALrBeO', '12/5/2019', 'sed accumsan felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e9160f72-2094-413c-9764-e39a5d9e5038', 'byyLVU3', '12/5/2019', 'cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('c9e75699-4da2-4411-9e59-71d4b81856c0', '7V0T7KKEKFXq', '12/5/2019', 'elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('1e9736bd-78ab-4dbd-9adc-40622a2f7223', 'LYwVleS', '12/5/2019', 'mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('f0e9ac85-9aaf-415c-87bb-160dc74ac6e4', 'j7iF5AaiP', '12/5/2019', 'amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('de4b5419-eed5-4829-b013-36d87e28b4ec', '00t2HuvUplb', '12/5/2019', 'id sapien in sapien iaculis congue vivamus metus arcu adipiscing');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('e6115a43-b3b7-4b45-9014-5f2ac0f913e2', 'qsfX5Ru', '10/27/2019', 'fusce consequat nulla nisl nunc nisl duis bibendum felis sed interdum');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('5bc3951b-9388-4af0-9bf5-ce435acc14f3', '49h9jXB', '10/27/2019', 'volutpat eleifend donec ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('30dbce76-1e3a-4ca1-9b8f-751f8e0db1d9', 'x5BpVKoIjiUX', '10/27/2019', 'posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec posuere metus');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('9c79e02d-14b7-4604-b5d3-2afae637bd0b', 'XgFgRDStIRa', '9/4/2019', 'in imperdiet et commodo vulputate justo in blandit ultrices enim');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('2534042c-6526-44b1-abd5-532d7b7b281a', 'u0PxpGApRTmO', '7/5/2019', 'at dolor quis odio consequat varius integer ac leo pellentesque ultrices mattis odio');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('ce80388a-d0cc-4096-9a01-7e8ef8d8017b', 'vvTjNg', '12/5/2019', 'tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('68973b78-642a-4ad9-ad0c-8f46977e6bf0', 'VN4c7SJc', '7/10/2019', 'eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('16710734-c5dc-460c-a7ad-54a7d3c92a63', 'S3LpbBAcSbM', '12/5/2019', 'odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus sit');
insert into Accounts (account_id, account_pass, date_created, account_type) values ('0dfbf360-7152-4c6a-b460-e103aa1ed4d6', 'LA2aqb4x', '12/5/2019', 'consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae');

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
insert into Restaurants (name, order_threshold) values ('Exeexe-Restaurant', '$11.47');
insert into Restaurants (name, order_threshold) values ('Simonis and Sons', '$12.24');
insert into Restaurants (name, order_threshold) values ('Vandervort, Rice and Lehner', '$12.62');
insert into Restaurants (name, order_threshold) values ('Bergnaum LLC', '$14.06');
insert into Restaurants (name, order_threshold) values ('Abbott-Harris', '$11.18');
insert into Restaurants (name, order_threshold) values ('Streich-Predovic', '$11.94');
insert into Restaurants (name, order_threshold) values ('Streich, Brekke and Bednar', '$11.18');
insert into Restaurants (name, order_threshold) values ('Blick, Boyer and Schroeder', '$11.84');
insert into Restaurants (name, order_threshold) values ('Kirlin-Jacobson', '$10.36');
insert into Restaurants (name, order_threshold) values ('Ziemann-Halvorson', '$10.20');

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


-- Orders
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (1, '3267e8b9-110c-44fb-a817-2c0b243b21d6', 1, 'credit card', '$5.00', '$16.70', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (3, '3c30a803-6834-41a9-b81e-6d54b6d5512d', 1, 'credit card', '$5.00', '$89.00', '2020-04-15 12:10:00', '2020-04-15 12:10:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (2, '1e9736bd-78ab-4dbd-9adc-40622a2f7223', 1, 'credit card', '$5.00', '$5.10', '2020-04-15 12:05:00', '2020-04-15 12:05:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', '2020-04-15 12:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (4, '2534042c-6526-44b1-abd5-532d7b7b281a', 2, 'cash', '$5.00', '$27.93', '2020-04-15 20:00:00', '2020-04-15 20:00:00', '2020-04-15 20:05:00', '2020-04-15 20:07:00', '2020-04-15 20:15:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (5, '0486583b-01d0-4c03-95d1-5e11d75a9efd', 2, 'credit card', '$5.00', '$76.89', '2020-04-15 12:20:00', '2020-04-15 12:20:00', '2020-04-15 12:30:00', '2020-04-15 12:40:00', '2020-04-15 13:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (7, '0486583b-01d0-4c03-95d1-5e11d75a9efd', 3, 'credit card', '$5.00', '$92.51', '2020-04-15 12:30:00', '2020-04-15 12:30:00', '2020-04-15 12:40:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (6, '0161cded-c664-4f1b-ad3f-7766dc48fecb', 3, 'credit card', '$5.00', '$23.82', '2020-04-15 12:25:00', '2020-04-15 12:25:00', '2020-04-15 12:35:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (8, '03667134-3ab1-41e2-bff4-e1e6e14d3035', 3, 'credit card', '$5.00', '$48.28', '2020-04-15 12:35:00', '2020-04-15 12:35:00', '2020-04-15 12:45:00', '2020-04-15 12:55:00', '2020-04-15 13:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (9, '68973b78-642a-4ad9-ad0c-8f46977e6bf0', 4, 'credit card', '$5.00', '$49.22', '2020-04-15 12:40:00', '2020-04-15 12:40:00', '2020-04-15 12:50:00', '2020-04-15 12:50:00', '2020-04-15 13:00:00', null);
insert into Orders (oid, rid, rest_id, payment_method, delivery_fee, total_price, order_placed, depart_for_rest, arrive_at_rest, depart_for_delivery, deliver_to_cust, promo_used) values (10, '06c7cf9a-cdfe-411d-93f4-5f6ad5d770bb', 4, 'cash', '$5.00', '$92.67', '2020-04-15 12:45:00', '2020-04-15 12:45:00', '2020-04-15 13:00:00', '2020-04-15 13:10:00', '2020-04-15 13:15:00', null);

-- Places
insert into Places (oid, cid) values (1, '1b39d987-c6b0-4493-bb95-96e51af734b2');
insert into Places (oid, cid) values (2, '1b39d987-c6b0-4493-bb95-96e51af734b2');
insert into Places (oid, cid) values (3, '1b39d987-c6b0-4493-bb95-96e51af734b2');

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

insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '4000-1523-1652-4534');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1543-4894-1561-1564');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1565-3158-1564-1945');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '1596-1345-1894-1564');
insert into CreditCards (cid, card_number) values ('1b39d987-c6b0-4493-bb95-96e51af734b2', '5434-4565-5270-0457');
