DROP TABLE IF EXISTS organizations;
CREATE TABLE public.organizations
(
    organization_id SERIAL PRIMARY KEY,
    name character varying(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email character varying(255) NOT NULL,
    logo_filename character varying(255) NOT NULL
);

ALTER TABLE IF EXISTS public.organizations
    OWNER to re_db_admin;


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');



-- ========================================
-- create table: projects
-- ========================================

-- Table: public.projects

DROP TABLE IF EXISTS public.projects;

CREATE TABLE IF NOT EXISTS public.projects
(
    project_id serial NOT NULL,
    title character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    location character varying(255) COLLATE pg_catalog."default",
    project_date date,
    organization_id serial NOT NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (project_id),
    CONSTRAINT organization_id FOREIGN KEY (organization_id)
        REFERENCES public.organizations (organization_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.projects
    OWNER to re_db_admin;


-- ========================================
-- Insert sample data: Projects
-- ========================================

INSERT INTO public."Projects" (title, description, location, project_date, organization_id)
VALUES
-- BrightFuture Builders (organization_id = 1)
('Community Center Renovation', 'Repairing and painting the local youth center.', '123 Main St, Springfield', '2026-10-05',1),
('Affordable Housing Framing', 'Helping build wood frames for low-income housing units.', '456 Oak Rd, Madison', '2026-10-12',1),
('Playground Safety Upgrade', 'Replacing old equipment and laying fresh wood chips.', 'City Park, Springfield', '2026-10-20',1),
('Wheelchair Ramp Construction', 'Building custom accessibility ramps for senior citizens.', '789 Pine St, Lincoln', '2026-11-02',1),
('Senior Home Winterization', 'Insulating windows and doors for elderly residents.', '321 Elm Ave, Springfield', '2026-11-15',1),

-- GreenHarvest Growers (organization_id = 2)
('Urban Garden Planting', 'Planting seasonal vegetables in community plot beds.', '555 Harvest Way, Austin', '2026-09-28',2),
('Compost Bin Construction', 'Building wooden compost bins for community recycling.', '777 Garden Blvd, Austin', '2026-10-08',2),
('Fruit Tree Pruning Workshop', 'Teaching and assisting with seasonal orchard pruning.', 'Northside Community Orchard', '2026-10-18',2),
('School Greenhouse Setup', 'Assembling a small greenhouse for an elementary school.', 'Lincoln Elementary School', '2026-11-01',2),
('Harvest Food Distribution', 'Gathering fresh produce and bundling it for local pantries.', 'Downtown Community Market', '2026-11-20',2),

-- UnityServe Volunteers (organization_id = 3)
('Downtown Food Drive', 'Collecting and packaging non-perishable goods for families.', 'Civic Center Plaza', '2026-10-01',3),
('Park Cleanup & Beautification', 'Clearing litter and planting flowers along river trails.', 'Riverside Park', '2026-10-15',3),
('After-School Tutoring Support', 'Assisting elementary students with math and reading.', 'Eastside Library', '2026-10-25',3),
('Coat & Blanket Collection', 'Sorting donated winter gear for shelter distribution.', 'Community Warehouse', '2026-11-05',3),
('Holiday Care Package Packing', 'Assembling care boxes for veterans and seniors.', 'Unity Hall', '2026-11-25',3);


-- ========================================
-- create table: category
-- ========================================

-- Table: public.category

DROP TABLE IF EXISTS public.category;

CREATE TABLE IF NOT EXISTS public.category
(
    category_id serial NOT NULL,
    category_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY (category_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.category
    OWNER to re_db_admin;

-- ========================================
-- Insert sample data: category
-- ========================================

INSERT INTO public.category (category_name)
VALUES
-- Environmental (category_id = 1)
('Environmental'),

-- Education (category_id = 2)
('Education'),

-- Community Services (category_id = 3)
('Community Services'),

-- Health and Wellness (category_id = 4)
('Health and Wellness')



-- ========================================
-- create table: project_categories
-- ========================================
-- Table: public.project_categories

-- DROP TABLE IF EXISTS public.project_categories;

CREATE TABLE IF NOT EXISTS public.project_categories
(
    project_id integer NOT NULL,
    category_id integer NOT NULL,
    CONSTRAINT project_categories_pkey PRIMARY KEY (project_id, category_id),
    CONSTRAINT project_categories_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES public.category (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT project_categories_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.projects (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_categories
    OWNER to re_db_admin;

-- ========================================
-- Insert sample data: project_categories
-- ========================================
INSERT INTO public.category (project_id,category_id)
VALUES
(1,3),
(2,3),
(3,3),
(4,3),
(5,3),
(6,1),
(7,1),
(8,1),
(9,2),
(10,3),
(11,3),
(12,3),
(13,2),
(14,3),
(15,3)
