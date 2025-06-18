<template>
  <div class="space-y-4 p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Company Management</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="company in companies"
        :key="company.id"
        class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ company.name }}</h3>
              <p class="text-sm text-gray-500">{{ company.industry }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <MapPin class="h-4 w-4 mr-2" />
            {{ company.location }}
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Users class="h-4 w-4 mr-2" />
            {{ company.employees }} employees
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <Calendar class="h-4 w-4 mr-2" />
            Founded {{ company.founded }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Building2, MapPin, Users, Calendar } from "lucide-vue-next";

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  founded: number;
}

// Sample data
const companies = ref<Company[]>([
  {
    id: 1,
    name: "TechCorp Inc.",
    industry: "Technology",
    location: "San Francisco, CA",
    employees: 150,
    founded: 2018,
  },
  {
    id: 2,
    name: "Green Energy Solutions",
    industry: "Renewable Energy",
    location: "Austin, TX",
    employees: 75,
    founded: 2020,
  },
  {
    id: 3,
    name: "Digital Marketing Pro",
    industry: "Marketing",
    location: "New York, NY",
    employees: 45,
    founded: 2019,
  },
]);
</script> 