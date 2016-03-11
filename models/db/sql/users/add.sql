INSERT INTO public.User (user_id,username,email,phone_number)
VALUES (${userId}::uuid,${username},${email},${phoneNumber})
