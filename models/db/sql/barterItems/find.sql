SELECT bi.barter_item_id AS "barterItemId",
       bi.user_id AS "userId",
       bi.title,
       bi.description,
       json_agg(json_build_object('imageId', bii.barter_item_image_id,'fileExtension',bii.file_extension)) AS images
FROM public.barter_item bi
JOIN public.barter_item_image bii ON bi.barter_item_id = bii.barter_item_id
WHERE bi.barter_item_id = $1::uuid
    AND bi.is_active = TRUE
    AND bii.is_active= TRUE
GROUP BY bi.barter_item_id
