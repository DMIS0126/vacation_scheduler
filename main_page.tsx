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
            body { font-family: 'Malgun Gothic', sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .subject { font-weight: bold; color: #2563eb; }
            .chapter { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1>${selectedClassData.className} 주차별 진도 계획표</h1>
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
                  <td>${week.week}주차</td>
                  <td class="subject">${week.subject}</td>
                  <td class="chapter">${week.chapter}</td>
                  <td>${week.details}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
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
