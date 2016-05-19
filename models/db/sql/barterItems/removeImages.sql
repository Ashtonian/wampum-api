UPDATE public.barter_item_image
SET is_active = FALSE
WHERE barter_item_image_id = $1::uuid
