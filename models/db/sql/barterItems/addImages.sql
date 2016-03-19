INSERT INTO public.barter_item_image (barter_item_image_id,barter_item_id,file_extension)
VALUES $1
RETURNING barter_item_image_id as "imageId"
