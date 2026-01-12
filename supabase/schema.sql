-- Supabase Books Table Schema
-- Run this in Supabase SQL Editor

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    publisher VARCHAR(255),
    published_year INTEGER,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster text search
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('simple', author));

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON books
    FOR SELECT USING (true);

-- Create policy to allow public insert
CREATE POLICY "Allow public insert" ON books
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public update
CREATE POLICY "Allow public update" ON books
    FOR UPDATE USING (true);

-- Create policy to allow public delete
CREATE POLICY "Allow public delete" ON books
    FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO books (title, author, isbn, publisher, published_year, description) VALUES
('클린 코드', '로버트 C. 마틴', '9788966260959', '인사이트', 2013, '애자일 소프트웨어 장인 정신'),
('리팩터링', '마틴 파울러', '9791162242742', '한빛미디어', 2020, '코드 품질을 개선하는 객체지향 사고법'),
('실용주의 프로그래머', '데이비드 토머스', '9788966263363', '인사이트', 2022, '숙련공에서 마스터로');
