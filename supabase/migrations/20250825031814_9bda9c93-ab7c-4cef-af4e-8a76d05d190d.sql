-- Security Fix: Add proper RLS policies to protect user email addresses
-- This addresses the critical security vulnerability where user emails could be harvested

-- Policy 1: Users can only view their own user record
CREATE POLICY "Users can view their own data only" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can only update their own user record
CREATE POLICY "Users can update their own data only" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Policy 3: System can insert new user records during signup
-- This policy allows the system to create new user records when users sign up
CREATE POLICY "Enable insert for authenticated users during signup" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy 4: Prevent deletion of user records for data integrity
-- Users should not be able to delete their own records to maintain referential integrity
-- Only admin/system should handle user deletion if needed
CREATE POLICY "Prevent user deletion" 
ON public.users 
FOR DELETE 
USING (false);