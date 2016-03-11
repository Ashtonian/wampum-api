SELECT *
FROM public.user
WHERE user_id = $1::uuid
