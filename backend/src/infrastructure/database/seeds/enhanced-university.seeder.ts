import { DataSource } from 'typeorm';
import { University, UniversityType, UniversityStatus } from '../entities/university.entity';
import { UniversityReviewCriterion, CriterionType, CriterionWeight } from '../entities/university-review-criterion.entity';
import * as fs from 'fs';
import * as path from 'path';

interface CrawledUniversityData {
  name: string;
  short_name?: string;
  english_name?: string;
  address?: string;
  location?: string[];
  city?: string | null;
  province?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
  type?: string;
  status?: string;
  founded_year?: number | null;
  accreditation?: string | null;
  specializations?: string[] | null;
  facilities?: string[] | null;
  achievements?: string[] | null;
  ranking_national?: string | null;
  ranking_international?: string | null;
  student_count?: number | null;
  faculty_count?: number | null;
  acceptance_rate?: number | null;
  tuition_fee_min?: number | null;
  tuition_fee_max?: number | null;
  currency?: string;
  admission_requirements?: string[] | null;
  scholarships?: string[] | null;
  international_partnerships?: string[] | null;
  campus_map_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_featured?: boolean;
  is_verified?: boolean;
  view_count?: number;
  review_count?: number;
  average_rating?: number;
  total_rating?: number;
  source?: string;
  crawled_at?: string;
}

export class EnhancedUniversitySeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Enhanced University Seeder starting...');

    // Seed review criteria first
    await this.seedReviewCriteria();

    // Seed universities from crawled data
    await this.seedUniversitiesFromCrawledData();

    // Seed additional manual universities (backup data)
    await this.seedManualUniversities();

    console.log('✅ Enhanced University seeding completed!');
  }

  private async seedReviewCriteria() {
    const criterionRepository = this.dataSource.getRepository(UniversityReviewCriterion);

    const criteria = [
      // Academic criteria
      {
        name: 'academic_quality',
        display_name: 'Chất lượng đào tạo',
        description: 'Đánh giá chất lượng giảng dạy, chương trình học và đội ngũ giảng viên',
        type: CriterionType.ACADEMIC,
        weight: CriterionWeight.CRITICAL,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 1,
        icon: 'graduation-cap',
        color: '#3B82F6',
      },
      {
        name: 'curriculum',
        display_name: 'Chương trình đào tạo',
        description: 'Tính cập nhật và phù hợp của chương trình đào tạo',
        type: CriterionType.ACADEMIC,
        weight: CriterionWeight.HIGH,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 2,
        icon: 'book-open',
        color: '#10B981',
      },
      {
        name: 'faculty_quality',
        display_name: 'Chất lượng giảng viên',
        description: 'Trình độ và kinh nghiệm của đội ngũ giảng viên',
        type: CriterionType.ACADEMIC,
        weight: CriterionWeight.HIGH,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 3,
        icon: 'users',
        color: '#8B5CF6',
      },

      // Facility criteria
      {
        name: 'infrastructure',
        display_name: 'Cơ sở vật chất',
        description: 'Chất lượng phòng học, thư viện, phòng thí nghiệm',
        type: CriterionType.FACILITY,
        weight: CriterionWeight.HIGH,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 4,
        icon: 'building',
        color: '#F59E0B',
      },
      {
        name: 'technology',
        display_name: 'Công nghệ và thiết bị',
        description: 'Mức độ hiện đại của công nghệ và thiết bị học tập',
        type: CriterionType.FACILITY,
        weight: CriterionWeight.MEDIUM,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 5,
        icon: 'laptop',
        color: '#EF4444',
      },
      {
        name: 'accommodation',
        display_name: 'Ký túc xá',
        description: 'Chất lượng ký túc xá và dịch vụ sinh viên',
        type: CriterionType.FACILITY,
        weight: CriterionWeight.MEDIUM,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 6,
        icon: 'home',
        color: '#06B6D4',
      },

      // Social criteria
      {
        name: 'student_life',
        display_name: 'Đời sống sinh viên',
        description: 'Hoạt động ngoại khóa, câu lạc bộ và sự kiện',
        type: CriterionType.SOCIAL,
        weight: CriterionWeight.MEDIUM,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 7,
        icon: 'heart',
        color: '#EC4899',
      },
      {
        name: 'diversity',
        display_name: 'Đa dạng văn hóa',
        description: 'Môi trường đa dạng và hòa nhập',
        type: CriterionType.SOCIAL,
        weight: CriterionWeight.LOW,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 8,
        icon: 'globe',
        color: '#84CC16',
      },

      // Career criteria
      {
        name: 'career_support',
        display_name: 'Hỗ trợ nghề nghiệp',
        description: 'Dịch vụ tư vấn nghề nghiệp và hỗ trợ việc làm',
        type: CriterionType.CAREER,
        weight: CriterionWeight.HIGH,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 9,
        icon: 'briefcase',
        color: '#6366F1',
      },
      {
        name: 'internship_opportunities',
        display_name: 'Cơ hội thực tập',
        description: 'Chất lượng và số lượng cơ hội thực tập',
        type: CriterionType.CAREER,
        weight: CriterionWeight.MEDIUM,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 10,
        icon: 'handshake',
        color: '#F97316',
      },
      {
        name: 'alumni_network',
        display_name: 'Mạng lưới cựu sinh viên',
        description: 'Sức mạnh và hoạt động của mạng lưới cựu sinh viên',
        type: CriterionType.CAREER,
        weight: CriterionWeight.MEDIUM,
        max_score: 5,
        is_active: true,
        is_required: false,
        sort_order: 11,
        icon: 'network-wired',
        color: '#A855F7',
      },

      // Overall criteria
      {
        name: 'overall_experience',
        display_name: 'Trải nghiệm tổng thể',
        description: 'Đánh giá tổng thể về trải nghiệm học tập',
        type: CriterionType.OVERALL,
        weight: CriterionWeight.CRITICAL,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 12,
        icon: 'star',
        color: '#FCD34D',
      },
      {
        name: 'value_for_money',
        display_name: 'Giá trị đồng tiền',
        description: 'Mức độ hài lòng về chi phí học tập so với chất lượng nhận được',
        type: CriterionType.OVERALL,
        weight: CriterionWeight.HIGH,
        max_score: 5,
        is_active: true,
        is_required: true,
        sort_order: 13,
        icon: 'dollar-sign',
        color: '#22C55E',
      },
    ];

    for (const criterion of criteria) {
      const existingCriterion = await criterionRepository.findOne({
        where: { name: criterion.name },
      });

      if (!existingCriterion) {
        await criterionRepository.save(criterion);
        console.log(`✅ Created criterion: ${criterion.display_name}`);
      }
    }
  }

  private async seedUniversitiesFromCrawledData() {
    const universityRepository = this.dataSource.getRepository(University);

    // Try to find the most recent crawled data file
    const crawledDataPath = this.findCrawledDataFile();
    
    if (!crawledDataPath) {
      console.log('⚠️ No crawled data file found. Skipping crawled data seeding.');
      return;
    }

    console.log(`📁 Loading crawled data from: ${crawledDataPath}`);

    try {
      const rawData = fs.readFileSync(crawledDataPath, 'utf8');
      const crawledUniversities: CrawledUniversityData[] = JSON.parse(rawData);

      console.log(`📊 Found ${crawledUniversities.length} universities in crawled data`);

      let createdCount = 0;
      let skippedCount = 0;

      for (const crawledUni of crawledUniversities) {
        // Skip universities with incomplete data
        if (!crawledUni.name || crawledUni.name.trim() === '') {
          skippedCount++;
          continue;
        }

        // Check if university already exists
        const existingUniversity = await universityRepository.findOne({
          where: { name: crawledUni.name },
        });

        if (existingUniversity) {
          skippedCount++;
          continue;
        }

        // Transform crawled data to university entity format
        const universityData = this.transformCrawledDataToUniversity(crawledUni);

        try {
          await universityRepository.save(universityData);
          createdCount++;
          console.log(`✅ Created university: ${crawledUni.name}`);
        } catch (error) {
          console.error(`❌ Error creating university ${crawledUni.name}:`, error);
        }
      }

      console.log(`📈 Summary: Created ${createdCount} universities, Skipped ${skippedCount} universities`);
    } catch (error) {
      console.error('❌ Error reading or parsing crawled data:', error);
    }
  }

  private findCrawledDataFile(): string | null {
    // Look for enhanced crawler data files
    const possiblePaths = [
      path.join(process.cwd(), 'enhanced_crawled_data', 'enhanced_universities_*.json'),
      path.join(process.cwd(), 'crawled_data', 'universities_*.json'),
      path.join(process.cwd(), '..', 'enhanced_crawled_data', 'enhanced_universities_*.json'),
      path.join(process.cwd(), '..', 'crawled_data', 'universities_*.json'),
    ];

    for (const pattern of possiblePaths) {
      try {
        const files = fs.readdirSync(path.dirname(pattern));
        const matchingFiles = files.filter(file => 
          file.startsWith('enhanced_universities_') || file.startsWith('universities_')
        ).sort().reverse(); // Get most recent first

        if (matchingFiles.length > 0) {
          return path.join(path.dirname(pattern), matchingFiles[0]);
        }
      } catch (error) {
        // Directory doesn't exist, continue to next pattern
      }
    }

    return null;
  }

  private transformCrawledDataToUniversity(crawledData: CrawledUniversityData): Partial<University> {
    // Map university type
    let universityType = UniversityType.PUBLIC;
    if (crawledData.type) {
      const typeLower = crawledData.type.toLowerCase();
      if (typeLower.includes('tư') || typeLower.includes('private')) {
        universityType = UniversityType.PRIVATE;
      } else if (typeLower.includes('quốc tế') || typeLower.includes('international')) {
        universityType = UniversityType.INTERNATIONAL;
      }
    }

    // Map university status
    let universityStatus = UniversityStatus.ACTIVE;
    if (crawledData.status) {
      const statusLower = crawledData.status.toLowerCase();
      if (statusLower.includes('inactive') || statusLower.includes('suspended')) {
        universityStatus = UniversityStatus.INACTIVE;
      }
    }

    // Parse location array
    let locationArray: string[] = [];
    if (crawledData.location && Array.isArray(crawledData.location)) {
      locationArray = crawledData.location;
    } else if (crawledData.city) {
      locationArray = [crawledData.city];
    }

    // Parse specializations
    let specializations: string[] = [];
    if (crawledData.specializations && Array.isArray(crawledData.specializations)) {
      specializations = crawledData.specializations;
    }

    // Parse facilities
    let facilities: string[] = [];
    if (crawledData.facilities && Array.isArray(crawledData.facilities)) {
      facilities = crawledData.facilities;
    }

    // Parse achievements
    let achievements: string[] = [];
    if (crawledData.achievements && Array.isArray(crawledData.achievements)) {
      achievements = crawledData.achievements;
    }

    // Parse admission requirements
    let admissionRequirements: string[] = [];
    if (crawledData.admission_requirements && Array.isArray(crawledData.admission_requirements)) {
      admissionRequirements = crawledData.admission_requirements;
    }

    // Parse scholarships
    let scholarships: string[] = [];
    if (crawledData.scholarships && Array.isArray(crawledData.scholarships)) {
      scholarships = crawledData.scholarships;
    }

    // Parse international partnerships
    let internationalPartnerships: string[] = [];
    if (crawledData.international_partnerships && Array.isArray(crawledData.international_partnerships)) {
      internationalPartnerships = crawledData.international_partnerships;
    }

    return {
      name: crawledData.name,
      short_name: crawledData.short_name || this.generateShortName(crawledData.name),
      english_name: crawledData.english_name || this.generateEnglishName(crawledData.name),
      address: crawledData.address || '',
      city: crawledData.city || this.extractCityFromAddress(crawledData.address),
      province: crawledData.province || this.extractProvinceFromAddress(crawledData.address),
      location: locationArray,
      phone: crawledData.phone || null,
      email: crawledData.email || null,
      website: crawledData.website || null,
      facebook: crawledData.facebook || null,
      logo_url: crawledData.logo_url || null,
      banner_url: crawledData.banner_url || null,
      description: crawledData.description || null,
      history: crawledData.history || null,
      mission: crawledData.mission || null,
      vision: crawledData.vision || null,
      type: universityType,
      status: universityStatus,
      founded_year: crawledData.founded_year || null,
      accreditation: crawledData.accreditation || null,
      specializations: specializations,
      facilities: facilities,
      achievements: achievements,
      ranking_national: crawledData.ranking_national || null,
      ranking_international: crawledData.ranking_international || null,
      student_count: crawledData.student_count || null,
      faculty_count: crawledData.faculty_count || null,
      acceptance_rate: crawledData.acceptance_rate || null,
      tuition_fee_min: crawledData.tuition_fee_min || null,
      tuition_fee_max: crawledData.tuition_fee_max || null,
      currency: crawledData.currency || 'VND',
      admission_requirements: admissionRequirements,
      scholarships: scholarships,
      international_partnerships: internationalPartnerships,
      campus_map_url: crawledData.campus_map_url || null,
      latitude: crawledData.latitude || null,
      longitude: crawledData.longitude || null,
      is_featured: crawledData.is_featured || false,
      is_verified: crawledData.is_verified || true,
      view_count: crawledData.view_count || 0,
      review_count: crawledData.review_count || 0,
      average_rating: crawledData.average_rating || 0.0,
      total_rating: crawledData.total_rating || 0,
    };
  }

  private generateShortName(name: string): string {
    // Extract key words from university name
    const words = name.split(' ').filter(word => 
      word.length > 2 && !['Đại', 'học', 'University', 'College'].includes(word)
    );
    
    if (words.length >= 2) {
      return words.slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    } else if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    }
    
    return name.substring(0, 4).toUpperCase();
  }

  private generateEnglishName(name: string): string {
    // Simple translation mapping
    const translations: { [key: string]: string } = {
      'Bách khoa': 'University of Science and Technology',
      'Quốc gia': 'National University',
      'Kinh tế': 'University of Economics',
      'Y': 'Medical University',
      'Nông nghiệp': 'Agricultural University',
      'Sư phạm': 'Pedagogical University',
      'Luật': 'University of Law',
      'Thương mại': 'University of Commerce',
      'Công nghệ': 'University of Technology',
    };

    for (const [vietnamese, english] of Object.entries(translations)) {
      if (name.includes(vietnamese)) {
        return name.replace(vietnamese, english);
      }
    }

    return name + ' University';
  }

  private extractCityFromAddress(address?: string): string | null {
    if (!address) return null;
    
    const cityPatterns = [
      /Hà Nội/i,
      /TP\.HCM|Thành phố Hồ Chí Minh/i,
      /Đà Nẵng/i,
      /Cần Thơ/i,
      /Huế/i,
      /Hải Phòng/i,
    ];

    for (const pattern of cityPatterns) {
      const match = address.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  private extractProvinceFromAddress(address?: string): string | null {
    if (!address) return null;
    
    // For now, return the same as city
    return this.extractCityFromAddress(address);
  }

  private async seedManualUniversities() {
    const universityRepository = this.dataSource.getRepository(University);

    // Manual universities as backup data
    const manualUniversities = [
      {
        name: 'Đại học Bách khoa Hà Nội',
        short_name: 'BKHN',
        english_name: 'Hanoi University of Science and Technology',
        address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
        city: 'Hà Nội',
        province: 'Hà Nội',
        location: ['Hà Nội'],
        phone: '024 3869 4242',
        email: 'contact@hust.edu.vn',
        website: 'https://www.hust.edu.vn',
        facebook: 'https://www.facebook.com/dhbkhanoi',
        logo_url: 'https://example.com/bkhn-logo.png',
        banner_url: 'https://example.com/bkhn-banner.png',
        description: 'Đại học Bách khoa Hà Nội là một trong những trường đại học hàng đầu Việt Nam về kỹ thuật và công nghệ.',
        history: 'Được thành lập năm 1956, Đại học Bách khoa Hà Nội có lịch sử hơn 60 năm phát triển.',
        mission: 'Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực kỹ thuật và công nghệ.',
        vision: 'Trở thành trường đại học nghiên cứu hàng đầu khu vực châu Á.',
        type: UniversityType.PUBLIC,
        status: UniversityStatus.ACTIVE,
        founded_year: 1956,
        accreditation: 'AUN-QA',
        specializations: ['Kỹ thuật', 'Công nghệ', 'Kinh tế', 'Ngoại ngữ'],
        facilities: ['Thư viện', 'Phòng thí nghiệm', 'Ký túc xá', 'Sân thể thao'],
        achievements: ['Top 1000 thế giới', 'Top 10 Việt Nam'],
        ranking_national: 'Top 5',
        ranking_international: 'Top 1000',
        student_count: 45000,
        faculty_count: 1200,
        acceptance_rate: 15.5,
        tuition_fee_min: 15000000,
        tuition_fee_max: 25000000,
        currency: 'VND',
        admission_requirements: ['Tốt nghiệp THPT', 'Điểm thi THPT Quốc gia'],
        scholarships: ['Học bổng tài năng', 'Học bổng khuyến khích học tập'],
        international_partnerships: ['MIT', 'Stanford', 'Tokyo University'],
        campus_map_url: 'https://maps.google.com/?q=21.0074,105.8412',
        latitude: 21.0074,
        longitude: 105.8412,
        is_featured: true,
        is_verified: true,
        view_count: 15000,
        review_count: 1250,
        average_rating: 4.2,
        total_rating: 5250,
      },
      {
        name: 'Đại học Quốc gia Hà Nội',
        short_name: 'VNU',
        english_name: 'Vietnam National University, Hanoi',
        address: '144 Xuân Thủy, Cầu Giấy, Hà Nội',
        city: 'Hà Nội',
        province: 'Hà Nội',
        location: ['Hà Nội'],
        phone: '024 3754 7869',
        email: 'contact@vnu.edu.vn',
        website: 'https://www.vnu.edu.vn',
        facebook: 'https://www.facebook.com/vnuhanoi',
        logo_url: 'https://example.com/vnu-logo.png',
        banner_url: 'https://example.com/vnu-banner.png',
        description: 'Đại học Quốc gia Hà Nội là hệ thống đại học đa ngành hàng đầu Việt Nam.',
        history: 'Được thành lập năm 1993, VNU là sự kết hợp của các trường đại học hàng đầu Hà Nội.',
        mission: 'Đào tạo nguồn nhân lực chất lượng cao cho đất nước.',
        vision: 'Trở thành đại học nghiên cứu hàng đầu khu vực.',
        type: UniversityType.PUBLIC,
        status: UniversityStatus.ACTIVE,
        founded_year: 1993,
        accreditation: 'AUN-QA',
        specializations: ['Khoa học tự nhiên', 'Khoa học xã hội', 'Công nghệ', 'Y tế'],
        facilities: ['Thư viện', 'Phòng thí nghiệm', 'Bệnh viện', 'Trung tâm nghiên cứu'],
        achievements: ['Top 1000 thế giới', 'Top 3 Việt Nam'],
        ranking_national: 'Top 3',
        ranking_international: 'Top 1000',
        student_count: 50000,
        faculty_count: 1500,
        acceptance_rate: 12.0,
        tuition_fee_min: 12000000,
        tuition_fee_max: 20000000,
        currency: 'VND',
        admission_requirements: ['Tốt nghiệp THPT', 'Điểm thi THPT Quốc gia'],
        scholarships: ['Học bổng tài năng', 'Học bổng nghiên cứu'],
        international_partnerships: ['Harvard', 'Oxford', 'Tokyo University'],
        campus_map_url: 'https://maps.google.com/?q=21.0368,105.7821',
        latitude: 21.0368,
        longitude: 105.7821,
        is_featured: true,
        is_verified: true,
        view_count: 18000,
        review_count: 1450,
        average_rating: 4.3,
        total_rating: 6235,
      },
    ];

    for (const university of manualUniversities) {
      const existingUniversity = await universityRepository.findOne({
        where: { name: university.name },
      });

      if (!existingUniversity) {
        await universityRepository.save(university);
        console.log(`✅ Created manual university: ${university.name}`);
      }
    }
  }
} 