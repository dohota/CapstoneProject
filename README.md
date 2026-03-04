## the order that i created table in postgresql database：
```sql
postgres=# CREATE DATABASE mydb;
CREATE DATABASE

postgres=# \c mydb
You are now connected to database "mydb" as user "karl".

mydb=# CREATE TABLE milling_train (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE

mydb=# CREATE TABLE project_plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    operation VARCHAR(100),
    year INTEGER
);
CREATE TABLE

mydb=# CREATE TABLE milling_unit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    number INTEGER,
    milling_length NUMERIC,
    under_feed_roll BOOLEAN,
    pressure_feeder BOOLEAN,
    pf_drive BOOLEAN,
    pf_rolls BOOLEAN,
    pinions BOOLEAN,
    delivery_rolls BOOLEAN,
    float_top_roll BOOLEAN,
    float_delivery_roll BOOLEAN,
    pinion_data BOOLEAN,
    milling_train_id INTEGER REFERENCES milling_train(id)
);
CREATE TABLE

mydb=# CREATE TABLE roller (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
CREATE TABLE

mydb=# CREATE TABLE roller_position (
    id SERIAL PRIMARY KEY,
    position VARCHAR(50) CHECK (position IN ('UF','PF','Mill'))
);
CREATE TABLE

mydb=# CREATE TABLE roller_allow_position (
    id SERIAL PRIMARY KEY,
    roller_id INTEGER REFERENCES roller(id),
    milling_unit_id INTEGER REFERENCES milling_unit(id),
    roller_position_id INTEGER REFERENCES roller_position(id)
);
CREATE TABLE

mydb=# CREATE TABLE pinion (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    number_teeth INTEGER,
    root_diameter NUMERIC,
    outside_diameter NUMERIC
);
CREATE TABLE
mydb=# CREATE TABLE pinion_position (
    id SERIAL PRIMARY KEY,
    position VARCHAR(50) CHECK (position IN ('UF','PF','Mill'))
);
CREATE TABLE
mydb=# CREATE TABLE pinion_allow_position (
    id SERIAL PRIMARY KEY,
    pinion_id INTEGER REFERENCES pinion(id),
    milling_unit_id INTEGER REFERENCES milling_unit(id),
    pinion_position_id INTEGER REFERENCES pinion_position(id)
);
CREATE TABLE
mydb=# 
mydb=# CREATE TABLE milset_data (
    id SERIAL PRIMARY KEY,

    project_id INTEGER REFERENCES project_plan(id),
    milling_unit_id INTEGER REFERENCES milling_unit(id),

    date DATE,
    season VARCHAR(50),
    description TEXT,
    exist_fields BOOLEAN,

    -- Roller references
    uf_roll_id INTEGER REFERENCES roller(id),
    tp_roll_id INTEGER REFERENCES roller(id),
    bpf_roll_id INTEGER REFERENCES roller(id),
    feed_roll_id INTEGER REFERENCES roller(id),
    top_roll_id INTEGER REFERENCES roller(id),
    delivery_roll_id INTEGER REFERENCES roller(id),

    -- Pinion references
    uf_pinion_id INTEGER REFERENCES pinion(id),
    tp_pinion_id INTEGER REFERENCES pinion(id),
    bpf_pinion_id INTEGER REFERENCES pinion(id),
    feed_pinion_id INTEGER REFERENCES pinion(id),
    top_pinion_id INTEGER REFERENCES pinion(id),
    delivery_pinion_id INTEGER REFERENCES pinion(id),

    roller_wear_id INTEGER,
    scene_analyze_id INTEGER
);
CREATE TABLE
```
