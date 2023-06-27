CREATE TABLE `item_to_item_addon_cat_map` (
`item_id` bigint NOT NULL,
`item_addon_cat_id` bigint NOT NULL,
`Sequence` int NOT NULL,
`host` varchar(100) DEFAULT NULL,
`store_id` bigint NOT NULL,
INDEX (`store_id`,`host`),
PRIMARY KEY (`item_id`,`item_addon_cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `item_addon_to_item_addon_cat_map` (
`item_addon_id` bigint NOT NULL,
`item_addon_cat_id` bigint NOT NULL,
`Sequence` int NOT NULL,
`host` varchar(100) DEFAULT NULL,
`store_id` bigint NOT NULL,
INDEX (`store_id`,`host`),
PRIMARY KEY (`item_addon_id`,`item_addon_cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `item_addon_cat_to_item_addon_map` (
`item_addon_cat_id` bigint NOT NULL,
`item_addon_id` bigint NOT NULL,
`host` varchar(100) DEFAULT NULL,
`Sequence` int NOT NULL,
`store_id` bigint NOT NULL,
INDEX (`store_id`,`host`),
PRIMARY KEY (`item_addon_id`,`item_addon_cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;