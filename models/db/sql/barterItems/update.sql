UPDATE public.barter_item
SET title = $2,
    description = $3
WHERE barter_item_id = $1::uuid
