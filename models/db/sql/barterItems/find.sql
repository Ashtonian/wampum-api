SELECT bi.barter_item_id,
       bi.user_id,
       bi.title,
       bi.description,
       json_agg(bii.*) AS images
FROM public.barter_item bi
JOIN public.barter_item_image bii ON bi.barter_item_id = bii.barter_item_id
WHERE bi.barter_item_id = $1::uuid
GROUP BY bi.barter_item_id
