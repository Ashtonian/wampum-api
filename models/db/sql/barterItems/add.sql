INSERT INTO public.barter_item (barter_item_id,user_id,title,description)
VALUES (${barterItemId}::uuid,${userId}::uuid,${title},${description})
RETURNING barter_item_id
