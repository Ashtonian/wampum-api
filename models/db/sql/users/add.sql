INSERT INTO public.User (user_id,email,phone_number,password,role)
VALUES (${userId}::uuid,${email},${phoneNumber},${password},${role}) RETURNING user_id AS "userId"
