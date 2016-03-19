update public.barter_item bi
set is_active = false
WHERE bi.barter_item_id = $1::uuid
