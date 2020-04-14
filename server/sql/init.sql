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
	card_number integer,
	primary key (cid, card_number),
	foreign key (cid) references Customers on delete cascade
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

CREATE TABLE Orders (
	oid serial,
	rid varchar(255) not null,
    	date_time timestamp not null,
    	payment_method text not null,
	delivery_fee money not null,
    	total_price real,
    	order_placed timestamp not null,
	depart_for_rest timestamp,
	depart_for_delivery timestamp,
	arrive_at_rest timestamp,
	deliver_to_cust timestamp,
	promo_used serial references Promos(promo_ID),
	primary key (oid),
	foreign key (rid) references Riders
);

CREATE TABLE Rates (
	rating integer,
	oid serial,
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


CREATE TABLE Restaurants (
	rest_id serial,
	name varchar(255) not null,
    order_threshold money not null,
    primary key(rest_id) 
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

-- trigger (for MAX_4hours in a shift) (add, update)
CREATE OR REPLACE FUNCTION check_max_shift_hour()
   RETURNS TRIGGER AS $$
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