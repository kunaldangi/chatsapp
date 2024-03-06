DO $$
DECLARE
    v_constraint_name TEXT;
    v_first_constraint BOOLEAN := TRUE;
BEGIN
    FOR v_constraint_name IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'user' AND constraint_name LIKE 'user_email_key%'
    LOOP
        IF NOT v_first_constraint THEN
            EXECUTE 'ALTER TABLE public."user" DROP CONSTRAINT ' || v_constraint_name || ';';
        END IF;
        v_first_constraint := FALSE;
    END LOOP;
END $$;
