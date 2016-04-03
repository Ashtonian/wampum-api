INSERT INTO public.User (user_id,email,phone_number,password)
VALUES (${userId}::uuid,${email},${phoneNumber},${password}) RETURNING user_id AS "userId"
