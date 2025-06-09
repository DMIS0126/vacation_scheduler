"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus, Download, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface WeeklyPlan {
  week: number
  subject: string
  chapter: string
  details: string
}

interface ClassPlan {
  id: string
  className: string
  weeks: WeeklyPlan[]
}

const mathSubjects = {
  "공통수학1": ["다항식", "방정식과 부등식", "경우의 수", "행렬"],
  "공통수학2": ["도형의 방정식", "집합과 명제", "함수"],  
  "수학I": ["지수함수와 로그함수", "삼각함수", "수열"],
  "수학II": ["함수의 극한과 연속", "미분", "적분"],
  "확률과 통계": ["경우의 수", "확률", "통계"],
  "미적분": ["수열의 극한", "미분법", "적분법"],
  "기하": ["이차곡선", "평면벡터", "공간도형과 공간좌표"],
}

export default function MathCurriculumPlanner() {
  const [classes, setClasses] = useState<ClassPlan[]>([])
  const [newClassName, setNewClassName] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [newWeek, setNewWeek] = useState<WeeklyPlan>({
    week: 1,
    subject: "",
    chapter: "",
    details: "",
  })

  const addNewClass = () => {
    if (newClassName.trim()) {
      const newClass: ClassPlan = {
        id: Date.now().toString(),
        className: newClassName,
        weeks: [],
      }
      setClasses([...classes, newClass])
      setNewClassName("")
      setSelectedClass(newClass.id)
    }
  }

  const addWeeklyPlan = () => {
    if (selectedClass && newWeek.subject && newWeek.chapter) {
      setClasses(
        classes.map((cls) =>
          cls.id === selectedClass
            ? { ...cls, weeks: [...cls.weeks, { ...newWeek }].sort((a, b) => a.week - b.week) }
            : cls,
        ),
      )
      setNewWeek({
        week: newWeek.week + 1,
        subject: "",
        chapter: "",
        details: "",
      })
    }
  }

  const removeWeeklyPlan = (classId: string, weekIndex: number) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId ? { ...cls, weeks: cls.weeks.filter((_, index) => index !== weekIndex) } : cls,
      ),
    )
  }

  const removeClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId))
    if (selectedClass === classId) {
      setSelectedClass("")
    }
  }

  const exportToPrint = () => {
    const selectedClassData = classes.find((cls) => cls.id === selectedClass)
    if (!selectedClassData) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>${selectedClassData.className} 진도 계획표</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
            
            body {
              font-family: 'Noto Sans KR', sans-serif;
              margin: 0;
              padding: 40px;
              background-color: #f8fafc;
              color: #1e293b;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              padding: 48px;
              border-radius: 24px;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            }
            
            .header {
              text-align: center;
              margin-bottom: 48px;
              padding-bottom: 24px;
              border-bottom: 3px solid #e2e8f0;
              position: relative;
            }
            
            .header::after {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 50%;
              transform: translateX(-50%);
              width: 100px;
              height: 3px;
              background: linear-gradient(90deg, #2563eb, #1e40af);
            }
            
            h1 {
              font-size: 36px;
              font-weight: 700;
              color: #1e40af;
              margin: 0 0 16px 0;
              letter-spacing: -0.5px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            
            .subtitle {
              font-size: 18px;
              color: #64748b;
              margin: 0;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            
            .subtitle::before,
            .subtitle::after {
              content: '';
              width: 40px;
              height: 1px;
              background: #e2e8f0;
            }
            
            table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin-top: 32px;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
              background: white;
            }
            
            th {
              background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
              padding: 20px;
              text-align: left;
              font-weight: 600;
              color: #334155;
              border-bottom: 2px solid #e2e8f0;
              font-size: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 20px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: middle;
              font-size: 15px;
              transition: all 0.2s ease;
            }
            
            tr:last-child td {
              border-bottom: none;
            }
            
            tr:hover td {
              background-color: #f8fafc;
            }
            
            .week {
              font-weight: 600;
              color: #1e40af;
              font-size: 16px;
              background: linear-gradient(135deg, #eff6ff, #dbeafe);
              padding: 8px 16px;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
            }
            
            .subject {
              font-weight: 600;
              color: #2563eb;
              background: linear-gradient(135deg, #eff6ff, #dbeafe);
              padding: 8px 16px;
              border-radius: 8px;
              display: inline-block;
              font-size: 15px;
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
            }
            
            .chapter {
              font-weight: 600;
              color: #dc2626;
              background: linear-gradient(135deg, #fef2f2, #fee2e2);
              padding: 8px 16px;
              border-radius: 8px;
              display: inline-block;
              font-size: 15px;
              box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
            }
            
            .details {
              color: #475569;
              font-size: 15px;
              line-height: 1.6;
              padding: 8px 0;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              
              .container {
                box-shadow: none;
                padding: 24px;
                max-width: 100%;
              }
              
              .header {
                margin-bottom: 24px;
              }
              
              .header::after {
                display: none;
              }
              
              .subtitle::before,
              .subtitle::after {
                display: none;
              }
              
              table {
                box-shadow: none;
              }
              
              tr:hover td {
                background-color: transparent;
              }
              
              .week,
              .subject,
              .chapter {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${selectedClassData.className} 진도 계획표</h1>
              <p class="subtitle">총 ${selectedClassData.weeks.length}주차 계획</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>주차</th>
                  <th>과목</th>
                  <th>단원</th>
                  <th>세부 내용</th>
                </tr>
              </thead>
              <tbody>
                ${selectedClassData.weeks
                  .map(
                    (week) => `
                  <tr>
                    <td class="week">${week.week}주차</td>
                    <td><span class="subject">${week.subject}</span></td>
                    <td><span class="chapter">${week.chapter}</span></td>
                    <td class="details">${week.details || "-"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const selectedClassData = classes.find((cls) => cls.id === selectedClass)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            수학 진도 계획표 생성기
          </h1>
          <p className="text-gray-600">방학 시즌 각 반별 주차별 진도를 쉽게 계획하고 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 반 관리 및 진도 입력 */}
          <div className="space-y-6">
            {/* 새 반 추가 */}
            <Card>
              <CardHeader>
                <CardTitle>반 관리</CardTitle>
                <CardDescription>새로운 반을 추가하고 관리하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="반 이름 (예: 고2-1반)"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addNewClass()}
                  />
                  <Button onClick={addNewClass}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center gap-1">
                      <Badge
                        variant={selectedClass === cls.id ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setSelectedClass(cls.id)}
                      >
                        {cls.className}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => removeClass(cls.id)} className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 주차별 진도 입력 */}
            {selectedClass && (
              <Card>
                <CardHeader>
                  <CardTitle>주차별 진도 입력</CardTitle>
                  <CardDescription>{selectedClassData?.className}의 진도를 추가하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="week">주차</Label>
                      <Input
                        id="week"
                        type="number"
                        min="1"
                        value={newWeek.week}
                        onChange={(e) => setNewWeek({ ...newWeek, week: Number.parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">과목</Label>
                      <Select
                        value={newWeek.subject}
                        onValueChange={(value) => setNewWeek({ ...newWeek, subject: value, chapter: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="과목 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(mathSubjects).map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {newWeek.subject && (
                    <div>
                      <Label htmlFor="chapter">단원</Label>
                      <Select
                        value={newWeek.chapter}
                        onValueChange={(value) => setNewWeek({ ...newWeek, chapter: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="단원 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {mathSubjects[newWeek.subject as keyof typeof mathSubjects].map((chapter) => (
                            <SelectItem key={chapter} value={chapter}>
                              {chapter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="details">세부 내용</Label>
                    <Input
                      id="details"
                      placeholder="세부 학습 내용 (선택사항)"
                      value={newWeek.details}
                      onChange={(e) => setNewWeek({ ...newWeek, details: e.target.value })}
                    />
                  </div>

                  <Button onClick={addWeeklyPlan} className="w-full">
                    진도 추가
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 진도 계획표 미리보기 */}
          <div>
            {selectedClassData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{selectedClassData.className} 진도 계획표</CardTitle>
                    <CardDescription>총 {selectedClassData.weeks.length}주차 계획</CardDescription>
                  </div>
                  <Button onClick={exportToPrint} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    인쇄/저장
                  </Button>
                </CardHeader>
                <CardContent>
                  {selectedClassData.weeks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>주차</TableHead>
                          <TableHead>과목</TableHead>
                          <TableHead>단원</TableHead>
                          <TableHead>세부내용</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedClassData.weeks.map((week, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{week.week}주차</TableCell>
                            <TableCell>
                              <Badge variant="outline">{week.subject}</Badge>
                            </TableCell>
                            <TableCell className="text-red-600 font-medium">{week.chapter}</TableCell>
                            <TableCell className="text-sm text-gray-600">{week.details || "-"}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => removeWeeklyPlan(selectedClass, index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">아직 진도가 추가되지 않았습니다.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {!selectedClass && classes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">시작하기</h3>
                  <p className="text-gray-500">먼저 반을 추가해서 진도 계획을 시작하세요.</p>
                </CardContent>
              </Card>
            )}

            {!selectedClass && classes.length > 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">반을 선택하세요</h3>
                  <p className="text-gray-500">위에서 반을 선택하여 진도 계획을 확인하거나 추가하세요.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
