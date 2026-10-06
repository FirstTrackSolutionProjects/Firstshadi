import { pool } from '../config/database.js';

export class Profile {
  static async create(profileData) {
    const {
      user_id, first_name, last_name, dob, age, religion, community, caste,
      mother_tongue, marital_status, height, weight, body_shape, face_color,
      blood_group, zodiac, manglik, country, state, city, current_address,
      permanent_address, birth_place, education, employed_in, occupation,
      annual_income, hobbies, about_me, favorite_color, favorite_song,
      favorite_movies, profile_photos, looking_for
    } = profileData;

    // Calculate age from DOB if not provided
    let calculatedAge = age;
    if (!calculatedAge && dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
    }

    const [result] = await pool.query(
      `INSERT INTO profiles (
        user_id, first_name, last_name, dob, age, religion, community, caste,
        mother_tongue, marital_status, height, weight, body_shape, face_color,
        blood_group, zodiac, manglik, country, state, city, current_address,
        permanent_address, birth_place, education, employed_in, occupation,
        annual_income, hobbies, about_me, favorite_color, favorite_song,
        favorite_movies, profile_photos, looking_for
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, first_name, last_name, dob, calculatedAge, religion, community, caste,
        mother_tongue, marital_status, height, weight, body_shape, face_color,
        blood_group, zodiac, manglik, country, state, city, current_address,
        permanent_address, birth_place, education, employed_in, occupation,
        annual_income, hobbies, about_me, favorite_color, favorite_song,
        favorite_movies, JSON.stringify(profile_photos || []), looking_for || 'Woman'
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, 
       (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', fm.id, 'relation', fm.relation, 'name', fm.name, 
                      'job', fm.job, 'occupation', fm.occupation, 'qualification', fm.qualification,
                      'is_married', fm.is_married)
        ) FROM family_members fm WHERE fm.profile_id = p.id) as family_members
       FROM profiles p
       WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const profile = rows[0];
    if (profile.profile_photos) {
      profile.profile_photos = JSON.parse(profile.profile_photos);
    }
    if (profile.family_members) {
      profile.family_members = JSON.parse(profile.family_members);
    }
    
    return profile;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT p.*, 
       (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', fm.id, 'relation', fm.relation, 'name', fm.name, 
                      'job', fm.job, 'occupation', fm.occupation, 'qualification', fm.qualification,
                      'is_married', fm.is_married)
        ) FROM family_members fm WHERE fm.profile_id = p.id) as family_members
       FROM profiles p
       WHERE p.user_id = ?`,
      [userId]
    );
    
    if (rows.length === 0) return null;
    
    const profile = rows[0];
    if (profile.profile_photos) {
      profile.profile_photos = JSON.parse(profile.profile_photos);
    }
    if (profile.family_members) {
      profile.family_members = JSON.parse(profile.family_members);
    }
    
    return profile;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'first_name', 'last_name', 'dob', 'age', 'religion', 'community', 'caste',
      'mother_tongue', 'marital_status', 'height', 'weight', 'body_shape', 'face_color',
      'blood_group', 'zodiac', 'manglik', 'country', 'state', 'city', 'current_address',
      'permanent_address', 'birth_place', 'education', 'employed_in', 'occupation',
      'annual_income', 'hobbies', 'about_me', 'favorite_color', 'favorite_song',
      'favorite_movies', 'profile_photos', 'looking_for', 'is_active'
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(field === 'profile_photos' ? JSON.stringify(data[field]) : data[field]);
      }
    }

    // Recalculate age if DOB changes
    if (data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      fields.push('age = ?');
      values.push(age);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async search(filters) {
    let query = `
      SELECT p.*, u.name, u.email, u.phone, u.gender, u.is_premium, u.premium_expiry,
             u.uuid as user_uuid,
             (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('id', fm.id, 'relation', fm.relation, 'name', fm.name, 
                            'job', fm.job, 'occupation', fm.occupation, 'qualification', fm.qualification)
              ) FROM family_members fm WHERE fm.profile_id = p.id) as family_members
      FROM profiles p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.is_active = 1 AND u.is_verified = 1
    `;

    const params = [];
    const conditions = [];

    if (filters.gender) {
      conditions.push('u.gender = ?');
      params.push(filters.gender);
    }

    if (filters.minAge) {
      conditions.push('p.age >= ?');
      params.push(filters.minAge);
    }

    if (filters.maxAge) {
      conditions.push('p.age <= ?');
      params.push(filters.maxAge);
    }

    if (filters.religion) {
      conditions.push('p.religion = ?');
      params.push(filters.religion);
    }

    if (filters.caste) {
      conditions.push('p.caste = ?');
      params.push(filters.caste);
    }

    if (filters.community) {
      conditions.push('p.community = ?');
      params.push(filters.community);
    }

    if (filters.mother_tongue) {
      conditions.push('p.mother_tongue = ?');
      params.push(filters.mother_tongue);
    }

    if (filters.city) {
      conditions.push('p.city = ?');
      params.push(filters.city);
    }

    if (filters.state) {
      conditions.push('p.state = ?');
      params.push(filters.state);
    }

    if (filters.education) {
      conditions.push('p.education = ?');
      params.push(filters.education);
    }

    if (filters.occupation) {
      conditions.push('p.occupation = ?');
      params.push(filters.occupation);
    }

    if (filters.is_premium !== undefined) {
      conditions.push('u.is_premium = ?');
      params.push(filters.is_premium);
    }

    if (filters.search_query) {
      conditions.push('(p.first_name LIKE ? OR p.last_name LIKE ? OR u.name LIKE ?)');
      const searchTerm = `%${filters.search_query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    // Whitelist order columns
    const allowedOrderBy = [
      'p.created_at', 'p.age', 'p.height', 'p.first_name', 'u.name', 'u.is_premium'
    ];
    const orderBy = allowedOrderBy.includes(filters.order_by) ? filters.order_by : 'p.created_at';
    const orderDir = (filters.order_dir || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${orderBy} ${orderDir}`;

    // Pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    // Process results
    const results = rows.map(row => {
      if (row.profile_photos) {
        row.profile_photos = JSON.parse(row.profile_photos);
      }
      if (row.family_members) {
        row.family_members = JSON.parse(row.family_members);
      }
      return row;
    });

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM profiles p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.is_active = 1 AND u.is_verified = 1
    `;
    
    if (conditions.length > 0) {
      countQuery += ' AND ' + conditions.join(' AND ');
    }

    // Remove limit/offset params for count query
    const countParams = params.slice(0, params.length - 2);
    const [countResult] = await pool.query(countQuery, countParams);

    return {
      data: results,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    };
  }

  static async getMatches(userId, filters = {}) {
    // Get user profile
    const userProfile = await this.findByUserId(userId);
    if (filters.minAge || filters.min_age) {
      conditions.push('p.age >= ?');
      params.push(filters.minAge || filters.min_age);
    }
    if (filters.maxAge || filters.max_age) {
      conditions.push('p.age <= ?');
      params.push(filters.maxAge || filters.max_age);
    }

    // Build match query based on user preferences
    const searchFilters = {
      gender: userProfile.looking_for || (userProfile.gender === 'Male' ? 'Woman' : 'Man'),
      minAge: filters.minAge || 18,
      maxAge: filters.maxAge || 50,
      religion: filters.religion || userProfile.religion,
      caste: filters.caste || userProfile.caste,
      mother_tongue: filters.mother_tongue || userProfile.mother_tongue,
      city: filters.city || userProfile.city,
      limit: filters.limit || 20,
      offset: filters.offset || 0
    };

    // Exclude self
    const results = await this.search(searchFilters);
    
    // Filter out self
    results.data = results.data.filter(p => p.user_id !== userId);

    return results;
  }

  static async delete(id) {
    await pool.query('DELETE FROM profiles WHERE id = ?', [id]);
    return true;
  }
}

export default Profile;