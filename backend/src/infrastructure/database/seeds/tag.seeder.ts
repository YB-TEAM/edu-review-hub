import { DataSource } from "typeorm";
import { Tag } from "../entities/tag.entity";

export class TagSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const tagRepository = this.dataSource.getRepository(Tag);

    const defaultTags: Array<Partial<Tag>> = [
      { name: "Tuyển sinh", description: "Thông tin tuyển sinh các trường", color: "#1f77b4" },
      { name: "Học bổng", description: "Thông tin học bổng và hỗ trợ tài chính", color: "#ff7f0e" },
      { name: "Đời sống sinh viên", description: "Trải nghiệm và chia sẻ đời sống sinh viên", color: "#2ca02c" },
      { name: "Chương trình đào tạo", description: "Thông tin ngành học và chương trình đào tạo", color: "#d62728" },
      { name: "Sự nghiệp", description: "Định hướng nghề nghiệp và cơ hội việc làm", color: "#9467bd" },
      { name: "Sự kiện", description: "Sự kiện và hoạt động tại trường", color: "#8c564b" },
      { name: "Ký túc xá", description: "Chỗ ở sinh viên và dịch vụ liên quan", color: "#e377c2" },
      { name: "Học phí", description: "Mức học phí và các khoản chi phí", color: "#7f7f7f" },
      { name: "Nghiên cứu", description: "Tin tức và hoạt động nghiên cứu", color: "#bcbd22" },
      { name: "Sinh viên quốc tế", description: "Thông tin cho sinh viên quốc tế", color: "#17becf" },
    ];

    for (const tagData of defaultTags) {
      const exists = await tagRepository.findOne({ where: { name: tagData.name } });
      if (!exists) {
        const tag = tagRepository.create({ ...tagData, isActive: true, usageCount: 0 });
        await tagRepository.save(tag);
        console.log(`✅ Seeded tag: ${tag.name}`);
      } else {
        console.log(`⚠️ Tag already exists: ${tagData.name}`);
      }
    }
  }
}


