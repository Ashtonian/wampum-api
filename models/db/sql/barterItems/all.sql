SELECT bi.barter_item_id AS "barterItemId",
       bi.user_id AS "userId",
       bi.title,
       bi.description,
       json_agg(json_build_object('imageId', bii.barter_item_image_id,'fileExtension',bii.file_extension))  AS images
FROM public.barter_item bi
JOIN public.barter_item_image bii ON bi.barter_item_id = bii.barter_item_id
where bi.is_active = true
GROUP BY bi.barter_item_id
