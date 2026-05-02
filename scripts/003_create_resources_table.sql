-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- course, tool, tutorial, video, website, book
    department TEXT NOT NULL, -- "General" or specific department name
    url TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read resources
CREATE POLICY "Resources are viewable by everyone" ON public.resources
    FOR SELECT USING (true);

-- Only service role can modify for now (simulating admin)
-- In a real app, you'd have an admin role or check for specific user IDs
CREATE POLICY "Only service role can modify resources" ON public.resources
    FOR ALL USING (auth.role() = 'service_role');

-- Insert initial resources
INSERT INTO public.resources (title, description, category, department, url, tags) VALUES
-- General
('MIT OpenCourseWare', 'Free lecture notes, exams, and videos from MIT.', 'course', 'General', 'https://ocw.mit.edu/', '{"free", "university", "mit"}'),
('Coursera', 'Online courses from top universities and companies.', 'course', 'General', 'https://coursera.org', '{"courses", "certificates"}'),
('Khan Academy', 'Personalized learning resource for all ages.', 'course', 'General', 'https://www.khanacademy.org/', '{"math", "science", "free"}'),
('Notion', 'All-in-one workspace for notes, tasks, and wikis.', 'tool', 'General', 'https://notion.so', '{"productivity", "notes"}'),

-- Software Engineering / CS / IT
('LeetCode', 'The best platform for technical interview prep.', 'career', 'Software Engineering', 'https://leetcode.com/', '{"coding", "interview", "dsa"}'),
('GitHub Student Developer Pack', 'The best free developer tools for students.', 'tool', 'Software Engineering', 'https://education.github.com/pack', '{"coding", "free", "tools"}'),
('MDN Web Docs', 'Resources for developers, by developers.', 'tutorial', 'Software Engineering', 'https://developer.mozilla.org/', '{"web", "js", "html", "css"}'),
('freeCodeCamp', 'Learn to code for free.', 'tutorial', 'Computer Science', 'https://www.freecodecamp.org/', '{"coding", "certification", "web"}'),
('GeeksforGeeks', 'A computer science portal for geeks.', 'tutorial', 'Computer Science', 'https://www.geeksforgeeks.org/', '{"dsa", "algorithms", "coding"}'),

-- Electrical Engineering
('All About Circuits', 'Electrical engineering & electronics community.', 'tutorial', 'Electrical Engineering', 'https://www.allaboutcircuits.com/', '{"electronics", "circuits", "ee"}'),
('EEWeb', 'Electrical engineering community and resources.', 'website', 'Electrical Engineering', 'https://www.eeweb.com/', '{"ee", "community", "tools"}'),
('Digi-Key Academic', 'Resources for electrical engineering students.', 'tool', 'Electrical Engineering', 'https://www.digikey.com/en/resources/edu', '{"parts", "projects", "ee"}'),

-- Mechanical Engineering
('Engineer4Free - Mech', 'Free engineering tutorials.', 'tutorial', 'Mechanical Engineering', 'https://www.engineer4free.com/mechanical-engineering', '{"mechanics", "dynamics", "me"}'),
('GrabCAD', 'The largest community of designers and engineers.', 'tool', 'Mechanical Engineering', 'https://grabcad.com/', '{"cad", "models", "community"}'),
('Engineering Toolbox', 'Tools and information for design and engineering.', 'tool', 'Mechanical Engineering', 'https://www.engineeringtoolbox.com/', '{"formulas", "data", "me"}'),

-- Civil Engineering
('Civil Digital', 'Civil engineering learning and community.', 'website', 'Civil Engineering', 'https://civildigital.com/', '{"civil", "learning", "data"}'),
('ICE - Institution of Civil Engineers', 'Knowledge and resources for civil engineers.', 'website', 'Civil Engineering', 'https://www.ice.org.uk/', '{"professional", "civil"}'),
('SkyCiv', 'Online structural engineering software.', 'tool', 'Civil Engineering', 'https://skyciv.com/', '{"structural", "software", "civil"}'),

-- Business / Accounting
('Investopedia', 'Dictionary for financial terms and investment education.', 'website', 'Business / Accounting', 'https://www.investopedia.com/', '{"finance", "business", "investment"}'),
('AccountingCoach', 'Learn accounting for free.', 'tutorial', 'Business / Accounting', 'https://www.accountingcoach.com/', '{"accounting", "free", "basics"}'),
('Harvard Business Review', 'Smart management thinking.', 'website', 'Business / Accounting', 'https://hbr.org/', '{"management", "strategy"}'),

-- Health Sciences
('Medscape', 'Medical news and clinical reference.', 'website', 'Health Sciences', 'https://www.medscape.com/', '{"medical", "reference", "clinical"}'),
('Khan Academy Medicine', 'Videos on health and medicine.', 'video', 'Health Sciences', 'https://www.youtube.com/user/khanacademymedicine', '{"medicine", "anatomy", "biology"}'),
('Kenhub', 'Anatomy learning platform.', 'tutorial', 'Health Sciences', 'https://www.kenhub.com/', '{"anatomy", "medical"}'),

-- Agriculture
('CABI Digital Library', 'Agriculture and bioscience resources.', 'website', 'Agriculture', 'https://www.cabidigitallibrary.org/', '{"research", "agriculture"}'),
('FAO - Food and Agriculture Organization', 'Knowledge sharing for agriculture.', 'website', 'Agriculture', 'https://www.fao.org/home/en', '{"global", "agriculture", "data"}'),
('AgDaily', 'Agriculture news and education.', 'website', 'Agriculture', 'https://www.agdaily.com/', '{"news", "farming"}'),

-- Architecture
('ArchDaily', 'The most visited architecture website in the world.', 'website', 'Architecture', 'https://www.archdaily.com/', '{"projects", "news", "architecture"}'),
('Detail Magazine', 'Review of Architecture and Construction Details.', 'website', 'Architecture', 'https://www.detail.de/en', '{"construction", "details", "design"}'),
('First In Architecture', 'Resources and guides for architecture students.', 'tutorial', 'Architecture', 'https://www.firstinarchitecture.co.uk/', '{"students", "guides", "cad"}'),

-- Law
('Oxfam Law Lib', 'Legal resources for development and justice.', 'website', 'Law', 'https://policy-practice.oxfam.org/our-approach/thematic-areas/legal-resources/', '{"justice", "policy", "development"}'),
('CommonLII', 'Free access to Commonwealth and common law.', 'website', 'Law', 'https://www.commonlii.org/', '{"legal", "common-law", "database"}'),
('LII / Legal Information Institute', 'Free legal information from Cornell Law.', 'website', 'Law', 'https://www.law.cornell.edu/', '{"legal", "reference", "law"}'),

-- Economics
('Economics Online', 'Free resources for students of Economics.', 'tutorial', 'Economics', 'https://www.economicsonline.co.uk/', '{"micro", "macro", "basics"}'),
('The Economist', 'Global news and analysis.', 'website', 'Economics', 'https://www.economist.com/', '{"news", "analysis", "global"}'),
('World Bank Open Data', 'Free and open access to global development data.', 'tool', 'Economics', 'https://data.worldbank.org/', '{"data", "stats", "development"}');
