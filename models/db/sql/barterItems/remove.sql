UPDATE public.barter_item
SET is_active = FALSE
WHERE barter_item_id = $1::uuid
