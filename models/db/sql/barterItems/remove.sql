UPDATE public.barter_item bi
SET is_active = FALSE
WHERE bi.barter_item_id = $1::uuid